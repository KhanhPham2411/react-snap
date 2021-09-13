import { FirestoreSevice } from '../../firestore-service';
import {ISnapshot} from '../../snapshot';
import { getMethods, mergeMethods } from '../../utils';
import { TestingGenerator } from './testing-generator';

export let snapshotDirectory = "react-snap-testing-sync";
const fse = require('fs-extra');

export class SnapshotService {
  static getCaller(){
    Error.stackTraceLimit = 20;
    const stack = new Error().stack;
    const matches = /\\(.[^\\]+)\.test\.ts/g.exec(stack?? "") as string[];
    const caller = matches[1];
    return caller;
  }
  
  static async fetch(className, functionName, update=false, testName: string|null=null): Promise<ISnapshot | null>{
    if(testName === null)
    {
      const path = SnapshotService.getPath(className, functionName);

      const pathExists = fse.pathExistsSync(path);
      if(!pathExists || update===true){
        const snapshot = await this.get(className, functionName);
        if(snapshot){
          SnapshotService.createSnapshotFile(snapshot, path)
        }else{
          return null;
        }
      }
      
      const snapshot = SnapshotService.readSnapshotFile(path);
      return snapshot;
    }else{
      const caller = this.getCaller();
      const callerPath = SnapshotService.getPath(className, functionName, caller)
      const testPath = SnapshotService.getPath(className, functionName, testName??"");
      if(!fse.pathExistsSync(testPath)){
        fse.renameSync(callerPath, testPath);
        fse.renameSync(TestingGenerator.getPath({className, functionName} as any, caller), 
          TestingGenerator.getPath({className, functionName} as any, testName??""));
      }
      if(update===true){
        const snapshot = await this.get(className, functionName);
        if(snapshot){
          SnapshotService.createSnapshotFile(snapshot, testPath)
        }
      }

      const snapshot = SnapshotService.readSnapshotFile(testPath);
      return snapshot;
    }
  }

  static async resolveMockMethods(snapshot: ISnapshot | null, namespaces){
    snapshot?.mocks.forEach((mock) => {
      if(mock.className){
        if(mock.isPrototype){
          jest.spyOn(namespaces[mock.className].prototype, mock.functionName).mockReturnValueOnce(mock.output);
        }else{
          jest.spyOn(namespaces[mock.className], mock.functionName).mockReturnValueOnce(mock.output);
        }
        
      }
    });

    if(snapshot?.className){
      if(snapshot.isPrototype){
        mergeMethods(namespaces[snapshot.className].prototype, snapshot?.classObject);
      }else{
        mergeMethods(namespaces[snapshot.className], snapshot?.classObject);
      }
    }
  }

  static async list(className, functionName, limit=20): Promise<ISnapshot[] | null>{
    const snapshots = await FirestoreSevice.get(className, functionName, limit) as ISnapshot[];
    return snapshots;
  }
  static async get(className, functionName): Promise<ISnapshot | null>{
    const snapshots = await FirestoreSevice.get(className, functionName);
    if(snapshots.length > 0){
      return snapshots[0] as any;
    }else{
      return null;
    }
  }
  static async sync(target, updateTest=false,updateSnapshot=false, config){
    
    await this.syncMethods(target, updateTest, updateSnapshot, config);

    const prototype = target.prototype;
    if(prototype){
      prototype.name = target.name;
      await this.syncMethods(prototype, updateTest, updateSnapshot, config);
    }
  }
  static async syncMethods(target, updateTest, updateSnapshot, config){
    const methods = getMethods(target);
    for(const functionName of methods){
      const snapshot = await SnapshotService.fetch(target.name, functionName, updateSnapshot);
      if(snapshot){
        TestingGenerator.generate(snapshot, config, updateTest);
      }
    }
  }
  static createSnapshotFile(object, path: string){
    const fse = require('fs-extra');
    fse.outputFileSync(path, JSON.stringify(object, null, 2));
  }
  static readSnapshotFile(path: string): ISnapshot{
    const fse = require('fs-extra');
    return fse.readJsonSync(path);
  }
  static getPath(className: string, functionName: string, fileName="index"): string{
    return `./${snapshotDirectory}/${className}/${functionName}/default/${fileName}.json`;
  }
}

