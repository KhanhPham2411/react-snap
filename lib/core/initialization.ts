import { SnapshotAspect } from '..';
import { FirebaseService } from './firebase-service';

export function initReactSnap(config){
  FirebaseService.ensureInitialized(config.firebaseConfig);

  const namespaces = config.namespaces;
  console.log("initReactSnap: ", config);
  
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