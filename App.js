/**
 *  This project uses the React Native framework, GiftedChat library, and 
 * Firestore/Firebase to create a chat application which allows a user to
 * select a background color, sign up, create and receive messages, take
 * or select a picture and send it, and send their location to others in
 * the chat.
 * 
 * App.js sets up the navigation for moving between the Start screen and 
 * Chat screen.
 * 
 * Start.js contains the Start class, which allows the user to enter their user name and select a background
 * * color.

 * Chat.js contains the Chat class, which handles all of the chat screen functions except where it calls
 * those from CustomActions.js.
 * 
 * CustomActions.js contains the CustomActions class, handles the pop-up menu and associated actions for
 * selecting an image to send, taking a picture to send, sending the user's
 * location, or cancelling the pop-up menu.
 * 
 * 
 */

import React, { Component } from 'react';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import React Navigation
import { createStackNavigator, createAppContainer } from 'react-navigation';

// create navigator for mapping to these screens
const navigator = createStackNavigator({
  Start: { screen: Start },
  Chat: { screen: Chat } 
});

// create app container to manage app state and link main nav to app environment
const NavigatorContainer = createAppContainer(navigator);

// export it as default navigator container
export default NavigatorContainer;

class App extends Component { 
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <NavigatorContainer />
    )
  }
}
