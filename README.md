# Getting Started
## Setting up the Development Environment
### Install Expo

To create new projects and start running Expo, 

1. Install the Expo CLI: `$npm install expo-cli --global` or `$yarn add global expo-cli`

1. Install the Expo app on your phone through either the iPhone App Store or Android Store.

1. Set up an Expo account on the [Expo webpage[ (https://expo.io/signup)

1. Go to the project directory `$cd React-Native-Chat-App`

1. Start Expo `$expo start`

This will open a new browser window "Metro Bundler" which is an HTTP server that transpiles the 
application's JavaScript with Babel, then serves it to the Expo app so that ES6+ code can be used.

(Make sure the phone and computer running Expo are on the same network)
1. Open the Expo app on your phone

1. If the project isn't listed, scan the QR Code from the browser - iPhone includes a QR Code scanner 
in the camera, so when the QR Code is centered within the yellow guides a pop-up will appear that allows
you to open the project in Expo.

### Database Configuration

This project uses Google Firebase/Firestore as the database for messages, in project __chat-ce808__
