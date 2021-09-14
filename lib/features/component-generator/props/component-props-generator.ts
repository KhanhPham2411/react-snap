import { ISnapshot } from '../../../snapshot';
import { snapshotDirectory } from '../../test-generator/snapshot-service';
import { TestingGenerator } from '../../test-generator/testing-generator';

const fse = require('fs-extra'); 
const fspath = require("path");

export class ComponentPropsGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "props.template"), "utf-8");
  
  static resolveTemplate(templateString, snapshot: ISnapshot, config){
    const innerProps = this.resolveInnerProps(snapshot);
    return this.fillTemplate(templateString, {
      ...snapshot,
      innerProps
    });
  }
  static resolveInnerProps(snapshot: ISnapshot) {
    const props = [];
    for (const key in snapshot.input[0]){
      props.push(`${key}: data.input[0].${key}`);
    }

    return props.join(",\n\t");
  }


  static getPath(snapshot: ISnapshot, folderName="default"): string{
    return `./${snapshotDirectory}/${snapshot.className}/${snapshot.functionName}/${folderName}/${snapshot.functionName}.props.ts`;
  }
}

