import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import NavigatorContainer from '../App';

export default class Chat extends Component {
    
    // display name entered on Start screen in nav bar
    static navigationOptions= ( { navigation }) => {
        return {
            title: navigation.getParam('name'),
        };
    }   

    render() {
        return (
            <View // background color is selected on Start screen
            style={[styles.container, {backgroundColor: this.props.navigation.state.params.bColor}]}>
            
                <Text>Welcome to the Chat screen!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
});