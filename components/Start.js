import React, { Component } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// import Platform to determine which OS
import { Platform } from 'react-native';

// import keyboard spacer so Android keyboard doesn't hide message input field
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class Start extends Component {
     
  constructor(props) {
    super(props);
    this.state={ 
        name: '',
        bColor: '#090C08', // default background color for chat screen
    }
  }

  render() {
    return (
        <View style={styles.container}>
            <ImageBackground 
                style={styles.background}
                source={require('../assets/BackgroundImage.png')}
                >
                    <Text style={styles.title}>Let's Chat</Text>
            <View style={styles.startBox}>
                <TextInput
                style={styles.textInput}
                onChangeText={(name)=>{this.setState({name})}}
                value={this.state.name}
                placeholder='Your Name'
                />
                { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
                <Text style={styles.colorBox}>Choose Background Color:</Text>
                <View style={styles.colorBox}>              
                    <TouchableOpacity 
                        style={(this.state.bColor==='#090C08') 
                        ? [styles.colorCircles, styles.circle1, styles.selected]
                        : [styles.colorCircles, styles.circle1]}
                        onPress={()=>{this.setState({bColor:'#090C08'})}}
                    ></TouchableOpacity>
                   <TouchableOpacity 
                        style={(this.state.bColor==='#474056') 
                        ? [styles.colorCircles, styles.circle2, styles.selected]
                        : [styles.colorCircles, styles.circle2]}
                        onPress={()=>{this.setState({bColor:'#474056'})}}
                    ></TouchableOpacity>
                    <TouchableOpacity 
                        style={(this.state.bColor==='#8A95A5') 
                        ? [styles.colorCircles, styles.circle3, styles.selected]
                        : [styles.colorCircles, styles.circle3]}
                        onPress={()=>{this.setState({bColor:'#8A95A5'})}}
                    ></TouchableOpacity>
                    <TouchableOpacity 
                        style={(this.state.bColor==='#B9C6AE') 
                        ? [styles.colorCircles, styles.circle4, styles.selected]
                        : [styles.colorCircles, styles.circle4]}
                        onPress={()=>{this.setState({bColor:'#B9C6AE'})}}
                    ></TouchableOpacity>
                </View>
                <Button 
                    style={styles.button}
                    onPress={()=>this.props.navigation.navigate('Chat', {name: this.state.name, bColor: this.state.bColor })}
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
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  background: {
      width: '100%',
      height: '100%',
  },
  title: {
      padding: 40,
      flex: .9,
      fontSize: 45,
      fontWeight: '600',
      color: '#FFFFFF',
      opacity: .5,
      alignSelf: 'center',
      justifyContent: 'center'
  },
  startBox: {
      backgroundColor: 'white',  
      flex: .9,
      margin:12,
      height: '44%',
      width: '88%',
      alignSelf: 'center', //adjusts horizontal position
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: 6,
  },  
  textInput: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 1,
      alignSelf: 'center',
      borderColor: '#757083',
      borderWidth: 1,
      paddingLeft: 20,
      width: '88%',
      height: 60
  },
  colorBox: {
      width: '88%',
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 20
  },
  colorCircles: {
    height: 50,
    width: 50,
    borderRadius: 25,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
      backgroundColor: '#090C08',
  },
  circle2: {
      backgroundColor: '#474056',
  },
  circle3: {
      backgroundColor: '#8A95A5',
  },
  circle4: {
      backgroundColor: '#B9C6AE',
  },
  selected: { // indicates selected color button
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
  button: {
      width: '88%',
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: '#747083',
      alignSelf: 'center',
      paddingLeft: 40,
    },
});
