import { FirestoreSevice, ISnapshot } from "../..";
import { WrapperComponent } from './wrapper-component';
import { SnapshotService } from '../test-generator/snapshot-service';

const fse = require('fs-extra');

export class ComponentService  {
  static async fetch(){
    const className = WrapperComponent.name;
    const snapshots = await FirestoreSevice.getByClass(className, 20) as ISnapshot[];
    snapshots.every(item => {
      const path = SnapshotService.getPath(item.className, item.functionName);
      const pathExists = fse.pathExistsSync(path);
      if(!pathExists){
        SnapshotService.createSnapshotFile(item, path);
      }
    });
  }
}

