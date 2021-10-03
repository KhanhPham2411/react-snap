import { ISnapshot } from '../../../snapshot';
import { snapshotDirectory } from '../../class-generator/snapshot-service';
import { TestingGenerator } from '../../class-generator/testing-generator';
import { original_function_predefined } from '../../../utils';

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
      if(snapshot.input[0][key] === original_function_predefined){
        props.push(`${key}: () => {}`);
        continue;
      }
      props.push(`${key}: data.input[0].${key}`);
    }

    return props.join(",\n\t");
  }


  static getFileName(snapshot: ISnapshot): string{
    return `${snapshot.functionName}.props.ts`;
  }
}

