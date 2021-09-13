import { namespaces } from '../react-snap-testing-sync/config'
import { SnapshotAspect } from './lib';
import { WrapperComponent } from './lib/features/component-generator/wrapper-component';

export function initReactSnapTesting(){
  Object.getOwnPropertyNames(namespaces).forEach((className) => {
    const classTarget = namespaces[className];
    if(classTarget.name == null){
      classTarget.name = className;
    }
    
    if(classTarget){
      SnapshotAspect.inject(classTarget);
      console.log(`injected ${className}`);
    }
  });
}


console.log("react-snap-testing");

export {
  WrapperComponent
}