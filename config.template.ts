import firebase from 'firebase';
import {GoogleAppAuthService} from '../src/bussiness/expo-services/GoogleAppAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppAuth from 'expo-app-auth';
import { SnapshotAspect } from '../react-snap-testing/lib/snapshot-aspect';

// config firebase to run snapshot aspect
export const firebaseConfig = {
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
export const namespaces = {
  // ...core,
  GoogleAppAuthService, 
  AsyncStorage, AppAuth
}

// exclude module to sync
SnapshotAspect.excludedToSync = {
  AsyncStorage, AppAuth
}


