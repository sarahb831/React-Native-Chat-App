import React, { Component } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import NavigatorContainer from '../App';

export default class Start extends Component {
     
  constructor(props) {
    super(props);
    this.state={ name: ''}
  }

  render() {
    return (
        <View style={styles.container}>
            <ImageBackground 
                style={styles.background}
                src={'../assets/Background Image.png'}>
                    <Text style={styles.title}>Let's Chat</Text>
            <View style={styles.startBox}>
                <TextInput
                style={styles.textInput}
                onChangeText={(name)=>{this.setState({name})}}
                value={this.state.name}
                placeholder='Your Name'
                />
                <Text>Choose Background Color:</Text>
                <View style={styles.colorBox}>
                    <View style={styles.colorCircle1RadioButton}>
                    </View>
                </View>
                <Button 
                    style={styles.button}
                    onPress={()=>this.props.navigation.navigate('Chat')}
                    title="Start Chatting"
                />
            </View>
            </ImageBackground>
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
