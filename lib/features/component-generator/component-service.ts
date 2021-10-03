import { FirestoreSevice, ISnapshot } from "../..";
import { WrapperComponent } from './wrapper/wrapper-component';
import { SnapshotService, snapshotDirectory } from '../class-generator/snapshot-service';
import { TestingGenerator } from "../class-generator/testing-generator";
import { ComponentPropsGenerator } from './props/component-props-generator';
import { ComponentStoriesGenerator } from './stories/component-stories-generator';
import { ComponentTestsGenerator } from './tests/component-tests-generator';

const fse = require('fs-extra');

export class ComponentService  {
  static async sync(config){
    const className = WrapperComponent.name;
    const snapshots = await FirestoreSevice.getByClass(className, 20) as ISnapshot[];

    this.syncSnapshots(snapshots, config);
  }

  static async syncSnapshots(snapshots, config){
    snapshots.every(item => {
      const path = SnapshotService.getPath(item.className, item.functionName, config);
      
      const pathExists = fse.pathExistsSync(path);
      if(!pathExists){
        SnapshotService.createSnapshotFile(item, path);
        ComponentPropsGenerator.generate(item, config);
        ComponentStoriesGenerator.generate(item, config)
        ComponentTestsGenerator.generate(item, config);
      }
    });
  }
}

