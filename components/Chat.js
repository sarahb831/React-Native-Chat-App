import React, { Component } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform } from 'react-native';
import { AsyncStorage } from 'react-native';
import NetInfo from  '@react-native-community/netinfo';

// import firebase and firestore for messages database
const firebase = require('firebase');
require('firebase/firestore');
const uuidv4 = require('uuid/v4');

// import keyboard spacer so Android keyboard doesn't hide message input field
import KeyboardSpacer from 'react-native-keyboard-spacer';
// import console = require('console');

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: 0,
            isOnline: true, /* flag for online or offline */
            messages: [
            {
                _id: 1,
                text: 'Welcome to the chat, '+ `${this.props.navigation.state.params.name}` + ',Please wait while messages are loaded...',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            ],
        };
        this.referenceMessagesUser = null;
        this.referenceMessages = {};
        this._isMounted = false;
    } // end constructor

    /* get messages from storage, convert string to object and update messages state
    */
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch(error) {
            console.log(error.message);
        }
    }

    async componentDidMount() {
      // check for internet connection
/* changed to EventListener
        NetInfo.isConnected.fetch().then(async isConnected => {
            if (!isConnected) {
                    console.log('offline');
                    this.setState({ isOnline: false });
            }   else { 
                console.log('online');
                this.setState({ isOnline: true });
 */   

  // use eventListener and unsubscribe function to monitor for network connectivity status
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            this.setState({ isOnline: state.isConnected });
// this.setState({ isOnline: false })            // need to change back to :state.isConnected          
console.log('this.state.isOnline: ', this.state.isOnline);
        })   
  
        if (this.state.isOnline === true) {
            // if not set up yet, connect app to Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey: "AIzaSyA9WNG0eAwqQRKsqRTxheRY1pr1q4gnixo",
                    authDomain: "chat-ce808.firebaseapp.com",
                    databaseURL: "https://chat-ce808.firebaseio.com",
                    projectId: "chat-ce808",
                    storageBucket: "chat-ce808.appspot.com",
                    messagingSenderId: "387898719560",
                    appId: "1:387898719560:web:39da93792d94ecf1c1477d" 
                });
            }

            // create reference to "messages" collection
            this.referenceMessages = firebase.firestore().collection('messages');
    
       
            // authenticate user anonymously with Firebase
            // auth() calls Firestore Auth service
            // onAuthStateChanged() is observer that is called whenever user's sign-in state changes,
            // it returns an unsubscribe() function which we name "authUnsubscribe" here 
            // and provides a user object (we use uid from it)
            this.authUnsubscribe = await firebase.auth().onAuthStateChanged(async (user) => {
                // if new user or user name has changed
                if (!user || (this.props.navigation.state.params.name !== user.name)) {
                    await firebase.auth().signInAnonymously();
                }

                // update user state with data for currently active user
                this.setState({
                    uid: user.uid
                });

                // create a reference to the active user's documents (messages) for this uid
                this.referenceMessagesUser = await firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
            
                // listen for collection changes for current user  (also returns 'unsubscribe() function')
                // calls the onCollectionUpdate() function 
                this.unsubscribeMessagesUser = await this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);

            }
            );
        }  else { // end if isOnline    
            this.getMessages();
        } 
        this._isMounted = true;
    }

    componentWillUnmount() {
        if (this._isMounted === true) {
            this.unsubscribeNetInfo(); 
            if (this.authUnsubscribe) {
                // stop listening to authentication changes if it was started when online
                this.authUnsubscribe();

                // stop listening to changes to messages if it was started when online
                if (this.unsubscribeMessagesUser) {
                    this.unsubscribeMessagesUser();
                }
            }
            this._isMounted = false;
        }
    }

    /* onSnapshot calls this function which retrieves current data from the messages   
        collection.  It loops through each document in the messages collection that has the
        correct uid, creating an array of these message objects which is then stored in
        the state "messages" so the data can be rendered in view
    */
    // querySnapshot is a snapshot of all data currently in the collection
    onCollectionUpdate = (querySnapshot) => {
        let messages = [];

        // go through each document
        querySnapshot.forEach((doc) => {
            // get QueryDocumentSnapshot's database
            var data = doc.data();
            var firebaseTime = data.createdAt;
            // convert from Firebase Timestamp object to Date using milliseconds - surprise!
            var timestamp = new Date(firebaseTime.seconds * 1000);
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: timestamp,
                user: {
                    _id: data.userId,
                    name: data.userName,
                    avatar: data.userAvatar,
                }
            });
        });
        // sort so latest is last
        messages.sort(function (a,b) {
            return b.createdAt - a.createdAt;
        });
        // set messages state to be this array of messages
        this.setState({ messages, });
console.log('onCollectionUpdate messages:', messages)

    }

    /* save messages in asyncStorage with key name being the same as collection name
        in Firebase */
    async saveMessages() {
        console.log('in saveMessages for asyncStorage')
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch(error) {
            console.log(error.message);
        }
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];   
        } catch(error) {
            console.log(error.message);
        }
    }    

    /* delete messages from asyncStorage
    */
    async deleteMessages() {
        try {
           await AsyncStorage.removeItem('messages');
        } catch(error) {
           console.log(error.message);
        }
        // confirm that messages were deleted
        let messages;
        try {
            messages = await AsyncStorage.getItem('messages') || [];  
        } catch(error) {
            console.log(error.message);
        }
    console.log('at end of deleteMessages, messages: ', messages)
    }

    /* append the newest message (when user presses 'send') to the 
        messages object so that it can be displayed in the chat trail.
        then use callback function in setState so that after state object
        is updated its current state is saved into asyncStorage using 
        saveMessages()
    */
    onSend(newMessage = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages,newMessage),
            }), () => {
                this.saveMessages(); // callback to asyncStorage saving
        })
    
        if (this.state.isOnline === true) {
        try {
            this.addMessage(newMessage);
        } catch(error) {
            console.log('Add to Firebase failed in onSend(): ',error.message);
        }
    }
    }

    // display name entered on Start screen in nav bar
    static navigationOptions= ( { navigation }) => {
        return {
            title: navigation.getParam('name'),
        };
    }

    /* add a new message to the collection in firebase */
    addMessage(newMessage) {
        if (newMessage.length > 0) {
            if (this.state.isOnline === true) {
                this.referenceMessages.add({
                    uid: (this.state.uid) ? this.state.uid : 0 ,
                    // giftedchat object format here
                    _id: uuidv4(),
                    text: (newMessage[0].text) ? newMessage[0].text : "no text",
                    createdAt: (newMessage[0].createdAt) ? newMessage[0].createdAt : 'yesterday',
                    userId: (newMessage[0].user._id) ? newMessage[0].user._id : this.state.uid,
                    userName: (this.props.navigation.state.params.name) ?this.props.navigation.state.params.name: "",
                    userAvatar: (newMessage[0].user) ? newMessage[0].user.avatar : "",
                })
            }
        }
    }

    /* change message bubble appearance
    */
    renderBubble(props) {
        let message = props.currentMessage;
        return (
            <Bubble
                { ...props }
                wrapperStyle = {{
                    right: {
                        backgroundColor: 'lightblue'
                    },
                    left: {
                        backgroundColor: 'darkblue'
                    }
                }}
            />
        )
    }

    /* only display InputToolbar if device is online
    */
    renderInputToolbar(props) {

console.log('in renderInputTolbar this._isMounted:', this._isMounted)

if (this.state !== null && this.state !== undefined) {console.log(this.state)}
        if (this.state !== null && this.state !== undefined && this.state.isOnline == false) {
 console.log('don"t render - this.state.isOnline:', this.state.isOnline)
                // don't render the input toolbar
        } else {
            console.log('renderInputToolbar in else')
            return (
                <InputToolbar
                    {...props}
                />
            );
        }

        } 
  
    render() {
console.log('isOnline in render:',this.state.isOnline)
        return (
            <View // background color is selected on Start screen
                style={[styles.container, {backgroundColor: this.props.navigation.state.params.bColor}]}>

                {(this._isMounted) && <GiftedChat
                    messages = {this.state.messages}
                    onSend = {messages => this.onSend(messages)}
                    renderBubble = {this.renderBubble}
                    renderInputToolbar = {this.renderInputToolbar}
                    createdAt = {new Date()}
                    user = {{
                        _id: this.state.uid,
                        name: this.props.navigation.state.params.name,
                        avatar: 'https://placeimg.com/140/140/any',
                    }}
                />
                }
                { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
            </View>
        );
    }
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
});