import firebase from 'firebase';

export class FirebaseService {
  static ensureInitialized(firebaseConfig){
    if(firebase.apps.length === 0){
      firebase.initializeApp(firebaseConfig);
    }
  }
}

