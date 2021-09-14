import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WrapperComponent } from './';

// config firebase to run snapshot aspect
export let firebaseConfig = {
  apiKey: "AIzaSyDBIZTVV7DvCwyUwUHku4T8LZ3Bl34K4vc",
  authDomain: "react-realtime-testing.firebaseapp.com",
  projectId: "react-realtime-testing",
  storageBucket: "react-realtime-testing.appspot.com",
  messagingSenderId: "503807435638",
  appId: "1:503807435638:web:c06eef72eb6e257408d057"
};
if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

// include module to inject
export let namespaces = {
  WrapperComponent,
  AsyncStorage
}

// exclude module to sync
export let excludedToSync = {
  AsyncStorage
}
