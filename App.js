import React, { Component } from 'react';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import React Navigation
import { createStackNavigator, createAppContainer } from 'react-navigation';

//create navigator for mapping to these screens
const navigator = createStackNavigator({
  Start: {screen: Start},
  Chat: {screen: Chat}
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
      < NavigatorContainer />
    )
  }
}
