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
        console.log('in pickImage');
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images',
            }).catch(error=>console.log(error));
            
            if (!result.cancelled) {
                this.setState({
                    image: result
                });
                console.log('image set', this.state.image)
                this.props.onSend([{ image: result.uri }]);
                return result.uri;
                }        
        }
    };

    /* get permission to access camera and let user take a picture
    */
   takePhoto = async() => {
    console.log('in takePhoto');
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync().catch(error=>console.log(error));
        
        if (!result.cancelled) {
            this.setState({
                image: result
            });
            console.log('picture taken and image set', this.state.image)
            this.props.onSend([{ image: result.uri }]);
            return result.uri;
            }        
    }
};

    /* get permission to access user's location and add location details to message
    */
   getLocation = async() => {
    console.log('in getLocation()');
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({}).catch(error=>console.log(error));
        
        if (!result.cancelled) {
            this.setState({
                location: result
            });
            console.log('location given', this.state.location)
            this.props.onSend([{ location: result }]);
            return result;
            }        
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
                switch(buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image, calling pickimage');
                        this.pickImage();
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        this.takePhoto();
                        return;
                    case 2:
                        console.log('user want to get their location');
                        this.getLocation();
                        return;
                        
                    default:
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
              {/*  {this.state.image && <Image source={{uri: this.state.image.uri}}
            style={{width: 200, height:200 }} />}
                    */}
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