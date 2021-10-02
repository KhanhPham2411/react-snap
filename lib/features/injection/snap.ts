import { SnapshotAspect } from '../../../lib';
import firebase from 'firebase';
import { FirebaseService } from '../../firebase-service';

export function initReactSnap(config){
  FirebaseService.ensureInitialized(config);

  const namespaces = config.namespaces;
  console.log("initReactSnapTesting: ", config);
  
  SnapshotAspect.excludedToSync = config.excludedToSync;
  Object.getOwnPropertyNames(namespaces).forEach((className) => {
    const classTarget = namespaces[className];
    if(classTarget == null) return;

    if(classTarget.name == null){
      classTarget.name = className;
    }

    SnapshotAspect.inject(classTarget);
    console.log(`injected ${className}`);
  });
}