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
                text: 'Please wait while messages are loaded...',
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

       
// needed since can't setState in constructor so can't use eventListener
/*        NetInfo.isConnected.fetch().then(isConnected => {
            this.state = { isOnline: isConnected };
            console.log('Online during constructor? ', this.state.isOnline);
        })
*/
        
    } // end constructor

    _isMounted = false;

    /* get messages from storage, convert string to object and updates messages state
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

        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ isOnline: isConnected });
            console.log('Online during componentDidMount? ', isConnected);
            console.log('this.state.isOnline in fetch:', this.state.isOnline);
        })

   /*
  // use eventListener and unsubscribe function to monitor for network connectivity status
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                this.setState({ isOnline: true });
            } else {
                this.setState({ isOnline: false })
            }
           // this.setState({ isOnline: state.isConnected });
            console.log("Online? ", state.isConnected);
        
            console.log('this.state.isOnline: ', this.state.isOnline);
        })   
*/
    /* set initial message on display */
      /*  this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello to my favorite chatter!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    // include name entered on Start screen in message
                    text: 'Welcome to the chat, ' + `${this.props.navigation.state.params.name}`,
// is user info needed for system message ?
                    user: {
                        _id: '',
                        name: this.props.navigation.state.params.name
                    },
                    createdAt: new Date(),
                    system: true,
                }
            ],
        })
*/
console.log('before this.state.isOnline check')
  if (this.state.isOnline === true) {

    // moved from constructor
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
console.log('creating referenceMessages');
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

            // update user state with currently active user data
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
/* readd if changed to listener
        this.unsubscribeNetInfo(); 
*/
        if (this._isMounted && this.authUnsubscribe) {
            // stop listening to authentication changes if it was started when online
            this.authUnsubscribe();

            // stop listening to changes to messages if it was started when online
            if (this.unsubscribeMessagesUser) {
                this.unsubscribeMessagesUser();
            }
            this._isMounted = false;
        }
    }

    // to fix ordering of messages
    compareTimes = (date1, date2) => {
        if (date1.createdAt < date2.createdAt) {
            return -1;
        }
        if (date1.createdAt > date2.createdAt) {
            return 1;
        }
        return 0;
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
console.log('firebaseTime: ',firebaseTime,' from ',data.text)
            // convert from Firebase Timestamp object to Date using milliseconds - surprise!
            var timestamp = new Date(firebaseTime.seconds * 1000);
console.log('timestamp in Date()', timestamp)
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: timestamp /*data.createdAt*/,
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
//        this.setState(previousState => ({ messages: [...previousState.messages, messages]}));
// try going back to this instead 9/18/19 since getting arrays inside arrays this way
        this.setState({ messages, });
console.log('onCollectionUpdate messages:', messages)

    }

    /* save messages in asyncStorage with key name being the same as collection name
        in Firebase
    */
   async saveMessages() {
       try {
           await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
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
   }

    /* append the newest message (when user presses 'send') to the 
        messages object so that it can be displayed in the chat trail.
        then use callback function in setState so that after state object
        is updated its current state is saved into asyncStorage using 
        saveMessages()
    */
    onSend(newMessage = []) {
 //       console.log('newMessage: in onSend',newMessage)
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages,newMessage),
        }), () => {
            this.saveMessages(); // to asyncStorage
        })
    
//console.log('jjjl',this.state.messages)
        try {
            this.addMessage(newMessage);
        } catch(error) {
            console.log('Add to Firebase failed in onSend(): ',error.message);
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
        //access new message
        if (newMessage.length > 0) {
           // const index = newMessage.length - 1
            //console.log('index', index);
//  console.log('newMessage in addMessage',newMessage)

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
            < Bubble
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
/*        if (this.state.isOnline) {
            if (this.state.isOnline === false) {
            //don't render it
            } else {
*/
                return (
                    <InputToolbar
                    {...props}
                    />
               );
 /*           }
        }
*/
    }

    render() {
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