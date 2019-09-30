import React, { Component } from 'react';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';


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

  /* renders component for customer actions (camera, 
    camera_roll, location)
    */
   renderCustomActions = (props) => {
     return <CustomActions {...props} />
   }

  render(){
    return (
      <NavigatorContainer screenProps ={{
        renderCustomActions : this.renderCustomActions
      }} />
    )
  }
}
