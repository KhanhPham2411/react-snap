import { FirestoreSevice } from '../../core/firestore-service';
import {ISnapshot} from '../../core/snapshot';
import { getMethods, mergeMethods } from '../../core/utils';
import { StoryGenerator } from './story-generator';
import { TestingGenerator } from './testing-generator';
import { ClassPropsGenerator } from './props/component-props-generator';

export let snapshotDirectory = "__react-snap__";
const fse = require('fs-extra');

export class SnapshotGenerator {
  static getCaller(){
    Error.stackTraceLimit = 20;
    const stack = new Error().stack;
    const matches = /\\(.[^\\]+)\.test\.ts/g.exec(stack?? "") as string[];
    const caller = matches[1];
    return caller;
  }
  
  static async fetch(className, functionName, config, update=false): Promise<ISnapshot | null>{
    const path = SnapshotGenerator.getPath(className, functionName, config);

    const pathExists = fse.pathExistsSync(path);
    if(!pathExists || update===true){
      const snapshot = await this.get(className, functionName);
      if(snapshot){
        SnapshotGenerator.createSnapshotFile(snapshot, path)
      }else{
        return null;
      }
    }
    
    const snapshot = SnapshotGenerator.readSnapshotFile(path);
    return snapshot;
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
      let snapshot = await SnapshotGenerator.fetch(target.name, functionName, config, updateSnapshot);
      if(snapshot){
        TestingGenerator.generate(snapshot, config, updateTest);
        ClassPropsGenerator.generate(snapshot, config, updateTest)
      }else{
        snapshot = {
          className: target.name,
          functionName: functionName
        } as any;
      }
      
      StoryGenerator.generate(snapshot, config, updateTest);
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
  static getPath(className: string, functionName: string, config, folderName="default"): string{
    return config.dirname + `/${snapshotDirectory}/${className}/${functionName}/${folderName}/${this.getFileName(className, functionName)}`;
  }
  static getFileName(className: string, functionName: string){
    return `${className}.${functionName}.data.json`;
  }
}

