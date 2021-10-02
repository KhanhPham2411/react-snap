import { WrapperComponent } from './';
import { initReactSnap } from './';

export let firebaseConfig = {
  apiKey: "AIzaSyDBIZTVV7DvCwyUwUHku4T8LZ3Bl34K4vc",
  authDomain: "react-realtime-testing.firebaseapp.com",
  projectId: "react-realtime-testing",
  storageBucket: "react-realtime-testing.appspot.com",
  messagingSenderId: "503807435638",
  appId: "1:503807435638:web:c06eef72eb6e257408d057"
};

// include module to inject
export let namespaces = {
  WrapperComponent
}


// exclude module to sync
export let excludedToSync = {
  
}

export const init = () => {
  initReactSnap({
    firebaseConfig,
    namespaces,
    excludedToSync
  })
}