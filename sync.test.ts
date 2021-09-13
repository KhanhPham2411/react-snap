import * as config from './config';
import { SnapshotService } from './lib/sync';
import { SnapshotAspect } from './lib/snapshot-aspect';

const mergedConfig = {...config};
const namespaces = mergedConfig.namespaces;

it('sync with SnapshotService', async () => {
  
  const updateTest = false;
  const updateSnapshot = false;
  
  const classes = Object.getOwnPropertyNames(mergedConfig.namespaces);
  const excludedToSyncClasses = Object.getOwnPropertyNames(SnapshotAspect.excludedToSync);

  for(const className of classes){
    if(excludedToSyncClasses.filter((item) => item === className).length > 0){
      continue;
    }

    const classTarget = mergedConfig.namespaces[className];
    if(classTarget){
      await SnapshotService.sync(classTarget, updateTest, updateSnapshot, mergedConfig);
    }
  }
}, 30000)

export {
  namespaces,
  SnapshotService,
}