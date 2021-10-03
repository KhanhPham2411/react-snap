import { snapshotEmitter } from '../../core/snapshot-decorator';
import { ISnapshot } from '../../core/snapshot';
import { original_component_predefined } from '../../core/utils';


export const register = () => {
  snapshotEmitter.on("onSnapshotBefore", (snapshotBefore: ISnapshot, originalFunc, target, descriptorSelf) => {
    if(descriptorSelf[original_component_predefined]){
      snapshotBefore.functionName = descriptorSelf[original_component_predefined].name;
    }
  })
  snapshotEmitter.on("onSnapshotAfter", (snapshotAfter: ISnapshot, originalFunc) => {
    
  })
}

