import { snapshotEmitter } from '../../snapshot-decorator';
import { ISnapshot } from '../../snapshot';
import { MockGenerator } from './mock-generator';

export const snapshotMap = {};

export const register = () => {
  snapshotEmitter.on("onSnapshotBefore", (snapshotBefore: ISnapshot, originalFunc, target) => {
    snapshotBefore.mocks = [];
    snapshotMap[snapshotBefore.functionId] = snapshotBefore;

    let originalString = originalFunc.toString() as string;
    originalString = originalString.replace(`${snapshotBefore.functionName}$`, 
      `${snapshotBefore.functionName}$` + snapshotBefore.functionId);

    let doEval = null;
    if(target.getEval){
      doEval = target.getEval();
    }else{
      if(target.prototype){
        if(target.prototype.getEval){
          doEval = target.prototype.getEval();
        }
      }
    }

    if(doEval){
      snapshotBefore.mockFunction = MockGenerator.mockFunction(originalString, doEval)
      snapshotBefore.eval = doEval;
    }
  })
  snapshotEmitter.on("onSnapshotAfter", (snapshotAfter: ISnapshot, originalFunc, callerFunc) => {
    if(snapshotAfter.callerId){
      const callerSnapshot: ISnapshot = snapshotMap[snapshotAfter.callerId];

      if(callerSnapshot){
        callerSnapshot.mocks.push({
          ...snapshotAfter,
          mocks: [],
        });
      }
    }

    delete snapshotAfter.mockFunction;
    delete snapshotAfter.eval;
    delete snapshotMap[snapshotAfter.functionId];
  })
}

