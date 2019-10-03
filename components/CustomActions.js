import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default class CustomActions extends Component {
    state = {
        image: null,
        location: null,
    };

    /* get permission to access CAMERA_ROLL and let user pick a picture, then update state with it
    */
    pickImage = async() => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images',
                }).catch(error=>console.log(error));
            
                if (!result.cancelled) {
                    this.setState({
                        image: result
                    });
                    this.props.onSend([{ image: result.uri }]);
                    return result.uri;
                }        
            }
        } catch(error) { 
            console.log(error);
        }
    };

    /* get permission to access camera and let user take a picture
    */
   takePhoto = async() => {
       try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync().catch(error=>console.log(error));
                if (!result.cancelled) {
                    this.setState({
                        image: result
                    });
                    this.props.onSend([{ image: result.uri }]);
                    return result.uri;
                }        
            }
        } catch(error) {
            console.log(error);
        }
    };

    /* get permission to access user's location and add location details to message
    */
    getLocation = async() => {
        try {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status === 'granted') {
                let result = await Location.getCurrentPositionAsync({}).catch(error=>console.log(error));
                if (!result.cancelled) {
                    this.setState({
                        location: result
                    });
                    this.props.onSend([{ location: result }]); // add location to message
                    return result;
                }        
            }
        } catch(error) {
            console.log(error);
        }
    };


    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', ' Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                try {
                    switch(buttonIndex) {
                        case 0:
                            this.pickImage();
                            return;
                        case 1:
                            this.takePhoto();
                            return;
                        case 2:
                            this.getLocation();
                            return;
                        
                        default:
                    }
                } catch(error) {
                    console.log(error);
                }
            },
        );
    };

    render() {
        return (
           
            <TouchableOpacity style={[styles.container]}
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Add image, take picture, include location"
                onPress = {this.onActionPress} >
                <View style = {[ styles.wrapper,
                    this.props.wrapperStyle ]}>
                    <Text style={[styles.iconText,
                        this.props.iconTextStyle]}>
                        +
                    </Text>
                </View> 
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: { //View
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};