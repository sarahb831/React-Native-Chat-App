import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { StyleSheet, View, Platform } from 'react-native';

// import keyboard spacer so Android keyboard doesn't hide message input field
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Chat extends Component {
    
    state = {
        messages: [
            {
                _id: 1,
                text: 'Hello my favorite chatter',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ],
    };

    ComponentDidMount() {
        /* set initial message on display */
// doesn't seem to be setting state
        this.setState({
            messages: [
              {
                _id: 2,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'React Native',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
              {
                  _id: 2,
                  text: 'This is a system message',
                  createdAt: new Date(),
                  system: true,
              }
            ],
          })
        }
      
    /* append the newest message (at time the change is applied) to the 
    messages object so that it can be displayed in the chat trail
    */
   
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
    // display name entered on Start screen in nav bar
    static navigationOptions= ( { navigation }) => {
        return {
            title: navigation.getParam('name'),
        };
    }   

    renderBubble(props) {
        return (
            <Bubble
                { ...props }
                wrapperStyle = {{
                    right: {
                        backgroundColor: 'purple'
                    }
                }}
                />
        )
    }
    render() {
        return (
            <View // background color is selected on Start screen
            style={[styles.container, {backgroundColor: this.props.navigation.state.params.bColor}]}>
            
                <GiftedChat
                    messages = {this.state.messages}
                    onSend =  {messages => this.onSend(messages)}
                    renderBubble = {this.renderBubble.bind(this)}
                    user = {{
                        _id: 1,
                    }}
                />
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