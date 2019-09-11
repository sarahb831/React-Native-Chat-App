import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform } from 'react-native';

// import firebase and firestore for messages database
const firebase = require('firebase');
require('firebase/firestore');
const uuidv4 = require('uuid/v4');

// import keyboard spacer so Android keyboard doesn't hide message input field
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Chat extends Component {
    constructor(props) {
        super(props);

        state = {
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
                    _id: uuidv4(),
                    text: 'Hello to my favorite chatter!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                _id: uuidv4(),
                // include name entered on Start screen in message
                text: `${this.props.navigation.state.params.name}`+' has entered the chat',
                createdAt: new Date(),
                system: true,
                }
            ],
        })

        // authenticate user anonymously with Firebase
       this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            // update user state with currently active user data
            this.setState({
                uid: user.uid
            });

        // create a reference to the active user's documents (messages)
        this.referenceMessagesUser = await firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
      // listen for collection changes for current user 
      this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);

          }
        );
        this._isMounted = true;
    }

    componentWillUnmount() {
        if (this._isMounted) {
            // stop listening to authentication
            this.authUnsubscribe();

            // stop listening to changes
            if (this.unsubscribeMessagesUser) {
                this.unsubscribeMessagesUser();
            }
            this._isMounted = false;
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];

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
        // set messages state to this array of messages
        this.setState({ messages });
    }
      
    /* append the newest message (when user presses 'send' to the 
    messages object so that it can be displayed in the chat trail
    */
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
    }))

    this.addMessage();
  }

    // display name entered on Start screen in nav bar
    static navigationOptions= ( { navigation }) => {
        return {
            title: navigation.getParam('name'),
        };
    }   

    /* add a new message to the collection in firebase  */
   addMessage() {
       //access last message in array
       if (this.state.messages.length > 0) {
        const index = this.state.messages.length - 1
        this.referenceMessages.add({
             uid: (this.state.uid) ? this.state.uid : 0 ,
                // giftedchat object format here
                _id: uuidv4(),
                text: (this.state.messages[index].text) ? this.state.messages[index].text : "",
                createdAt: (this.state.messages[index].createAt) ? this.state.messages[index].createAt : "",
                userId: (this.state.messages[index].user._id) ? this.state.messages[index].user._id : "",
                userName: (this.props.navigation.state.params.name) ?this.props.navigation.state.params.name: "", 
                userAvatar: (this.state.messages[index].user.avatar) ? this.state.messages[index].user.avatar : "",
            })
        }
    }

    /* change message bubble appearance
    */
    renderBubble(props) {
        return (
            <Bubble
                { ...props }
                wrapperStyle = {{
                    right: {
                        backgroundColor: 'lightblue'
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
                    messages = {(this.state.messages) ? this.state.messages : []}
                    onSend =  {messages => this.onSend(messages)}
                    renderBubble = {this.renderBubble.bind(this)}
                    user = {{
                        _id: 1,
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