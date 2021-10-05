import { ISnapshot } from '../../../core/snapshot';
import { snapshotDirectory } from '../snapshot-generator';
import { TestingGenerator } from '../testing-generator';
import { original_function_predefined } from '../../../core/utils';

const fse = require('fs-extra'); 
const fspath = require("path");
const JsonToTS = require('json-to-ts')

export class ClassPropsGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "props.template"), "utf-8");
  
  static resolveTemplate(templateString, snapshot: ISnapshot, config){
    const typeInterfaces = this.resolveInterfaces(snapshot);
    return this.fillTemplate(templateString, {
      ...snapshot,
      typeInterfaces
    });
  }
  static resolveInterfaces(snapshot: ISnapshot) {
    const result = [];
    JsonToTS(snapshot).forEach( typeInterface => {
      result.push(typeInterface)
    })

    return result.join("\n");
  }


  static getFileName(snapshot: ISnapshot): string{
    return `${snapshot.className}.${snapshot.functionName}.props.ts`;
  }
}

