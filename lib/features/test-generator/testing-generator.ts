import { ISnapshot } from "../../snapshot";
import {snapshotDirectory} from './snapshot-service';
import {getFuncList, getFunc} from '../../utils';

const fse = require('fs-extra'); 
const fspath = require("path");

export class TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "template.text"), "utf-8");
  static generate(snapshot: ISnapshot, update=false, config){
    const testPath = this.getPath(snapshot);
    if(fse.pathExistsSync(testPath) && update===false){
      return;
    }

    const resolvedTemplate = this.resolveTemplate(this.templateString, snapshot, config);
    fse.outputFileSync(testPath, resolvedTemplate);
  }
  static resolveTemplate(templateString, snapshot: ISnapshot, config){
    const matchSnapshot = this.resolveMatchSnapshotTemplate(snapshot);
    const target = this.resolveTarget(snapshot);

    return this.fillTemplate(templateString, {
      ...snapshot,
      matchSnapshot,
      target
    });
  }
  static resolveMock(snapshot: ISnapshot, config: any) {
    const { namespaces } = config;
    const funcString: string = getFunc(namespaces, snapshot.className, snapshot.functionName).toString();
    const mock: string[] = [];
    const funcList = getFuncList(namespaces);
    if(snapshot.functionName === "getLatestAuthInfoAsync"){
      debugger;
    }
    for(const func of funcList){
      let classMock = func.split(".")[0];
      const functionMock = func.split(".")[1];

      if(funcString.indexOf(func) > -1 || funcString.indexOf(`this.${functionMock}`) > -1){
        const mockTemplate = 
        `const ${functionMock}Snapshot = await SnapshotService.fetch("${classMock}", "${functionMock}");\n\tjest.spyOn(namespaces["${classMock}"],  "${functionMock}").mockReturnValue(${functionMock}Snapshot?.output);\n\t`;
        mock.push(mockTemplate);
      }
    }
    
    return mock.join("");
  }

  static resolveTarget(snapshot: ISnapshot){
    if(snapshot.isPrototype){
      return `namespaces["${snapshot.className}"].prototype`;
    }

    return `namespaces["${snapshot.className}"]`;
  }

  static resolveMatchSnapshotTemplate(snapshot: ISnapshot){
    const resolved = ["input", "classObject", "mocks", "output"].map((item) => {
      return `expect(snapshot?.${item}).toMatchSnapshot();`;

      // if(JSON.stringify(snapshot[item]).length > 100){
      //   return `expect(snapshot?.${item}).toMatchSnapshot();`;
      // }else{
      //   return `expect(snapshot?.${item}).toMatchInlineSnapshot();`;
      // }
    })

    return resolved.join("\n\t");
  }

  static fillTemplate(templateString, templateVars){
    return new Function("return `"+templateString +"`;").call(templateVars);
  }

  static getPath(snapshot: ISnapshot, fileName="index"): string{
    return `./${snapshotDirectory}/${snapshot.className}/${snapshot.functionName}/${fileName}.test.ts`;
  }
}
