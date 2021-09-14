import * as config from './config'
import { SnapshotAspect } from './lib';
import { WrapperComponent } from './lib/features/component-generator/wrapper/wrapper-component';

export function initReactSnapTesting(overrideConfig){
  const mergedConfig = {
    ...config,
    ...overrideConfig
  }
  const namespaces = mergedConfig.namespaces;
  console.log("initReactSnapTesting: ", mergedConfig);
  
  SnapshotAspect.excludedToSync = mergedConfig.excludedToSync;
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

console.log("react-snap-testing");

export {
  WrapperComponent
}