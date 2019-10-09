# Getting Started
## Setting up the Development Environment
### Install Expo

To create new projects and start running Expo, 

1. Install the Expo CLI from the terminal: `$npm install expo-cli --global` or `$yarn add global expo-cli`

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

This project uses Google Firebase/Firestore (https://firebase.google.com) as the database for messages, in project __chat-ce808__.

1. To set up the Firestore database, you'll need to sign-in then click the __Go to console__ link.  You'll want to start in test mode so we don't need to create security rules for read/write access.

1.  Then you'll need to install Firestone via Firebase for the project: `$yarn add firebase` or `$npm install firebase`

1. In App.js, we need to import Firestore: 

```
const firebase = require('firebase');
require ('firebase/firestore');
```

1. Back in the browser, open up __Project Settings__, then __General__ tab, __Your apps__ . This is where you can generate configurations for different platforms.  Click __Firestore for Web__ to open the model.  This is the configuration information that will be integrated into App.js so that the app can connect to Firestore.  Copy the contents of the config object from __{apiKey__ to __messaging...}__

1.  Create a constructor in App.js to initialize the Firestore app:

```
firebase.initializeApp({

// paste the copied code here

});
```
1. Then create a reference to the Firestore collection: `this.referenceMessages = firebase.firestore().collection('chat');`

### Needed libraries

In addition to the libraries indicated above (firebase and expo-cli), you'll need to install the following ones:

1. These should have been installed automatically with expo-cli: React Native, React-Native-Dom, React-Native-Web (allows React Native to run on browsers as well, if not, add them as __react-native__, __react


