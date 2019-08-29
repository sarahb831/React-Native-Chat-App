import React, { Component } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
//import NavigatorContainer from '../App';

export default class Chat extends Component {
    
    static navigationOptions= ( { navigation }) => {
        return {
            title: navigation.getParam('name'),
        };
    }   

    render() {
        return (
            <View style={[styles.container, {backgroundColor: this.props.navigation.state.params.bColor}]}>
            
                <Text>Welcome to the Chat screen!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
      width: '100%',
      height: '100%',
  },
  title: {
      fontSize: 45,
      fontWeight: '600',
      color: '#757083',
      opacity: .5,
  },
  startBox: {
      backgroundColor: 'white',
      width: '88%',
      height: '44%',
      alignItems: 'flex-end',
      justifyContent: 'center',

  },  
  textInput: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 1,
  },
  colorBox: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 1
  },
  colorCircles: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
  },
  circle1RadioButton: {
      backgroundColor: '#090C08',
  },
  circle2RadioButton: {
      backgroundColor: '#474056',
  },
  circle3RadioButton: {
      backgroundColor: '#8A95A5',
  },
  circle4RadioButton: {
      backgroundColor: '#B9C6AE',
  },
  button: {
      fontSize: 16,
      fontWeight: '600',
      color: '#757083',
    },
});
