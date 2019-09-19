import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform } from 'react-native';

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

        this.referenceMessagesUser = null;
    };

    _isMounted = false;

    async componentDidMount() {
    /* set initial message on display */
        this.setState({
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
        this._isMounted = true;
    }

    componentWillUnmount() {
        if (this._isMounted) {
            // stop listening to authentication changes
            this.authUnsubscribe();

            // stop listening to changes
            if (this.unsubscribeMessagesUser) {
                this.unsubscribeMessagesUser();
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
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt,
                user: {
                    _id: data.userId,
                    name: data.userName,
                    avatar: data.userAvatar,
                }
            });
        });
        // set messages state to be this array of messages
//        this.setState(previousState => ({ messages: [...previousState.messages, messages]}));
// try going back to this instead 9/18/19
        this.setState({ messages, });
        console.log('onCollectionUpdate messages:', messages)

    }

    /* append the newest message (when user presses 'send') to the 
        messages object so that it can be displayed in the chat trail
    */
    onSend(newMessage) {
        console.log('lkjfdl  newMessage:',newMessage)
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages,newMessage),
        }))
    
console.log('jjjl',this.state.messages)
        this.addMessage(newMessage);
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
  console.log('newMessage in addMessage',newMessage)

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

    render() {
        return (
            <View // background color is selected on Start screen
                style={[styles.container, {backgroundColor: this.props.navigation.state.params.bColor}]}>

                {(this._isMounted) && <GiftedChat
                    messages = {this.state.messages}
                    onSend = {messages => this.onSend(messages)}
                    renderBubble = {this.renderBubble}
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