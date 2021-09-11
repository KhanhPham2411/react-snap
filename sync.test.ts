import { namespaces } from '../react-snap-testing-sync/config';
import { SnapshotService } from './lib/sync';
import { SnapshotAspect } from './lib/snapshot-aspect';

it('sync with SnapshotService', async () => {
  const updateTest = false;
  const updateSnapshot = false;
  
  const classes = Object.getOwnPropertyNames(namespaces);
  const excludedToSyncClasses = Object.getOwnPropertyNames(SnapshotAspect.excludedToSync);
  const config = {
    namespaces
  };

  for(const className of classes){
    if(excludedToSyncClasses.filter((item) => item === className).length > 0){
      continue;
    }

    const classTarget = namespaces[className];
    if(classTarget){
      await SnapshotService.sync(classTarget, updateTest, updateSnapshot, config);
    }
  }
}, 30000)

export {
  namespaces,
  SnapshotService,
}