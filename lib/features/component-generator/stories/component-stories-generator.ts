import { ISnapshot } from '../../../snapshot';
import { snapshotDirectory } from '../../test-generator/snapshot-service';
import { TestingGenerator } from '../../test-generator/testing-generator';

const fse = require('fs-extra'); 
const fspath = require("path");

export class ComponentStoriesGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "stories.template"), "utf-8");
  
  static resolveTemplate(templateString, snapshot: ISnapshot, config){
    return this.fillTemplate(templateString, {
      ...snapshot,
    });
  }


  static getPath(snapshot: ISnapshot, folderName="default"): string{
    return `./${snapshotDirectory}/${snapshot.className}/${snapshot.functionName}/${folderName}/${snapshot.functionName}.stories.tsx`;
  }
}
