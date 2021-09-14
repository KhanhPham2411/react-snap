import { ISnapshot } from '../../../snapshot';
import { snapshotDirectory } from '../../test-generator/snapshot-service';
import { TestingGenerator } from '../../test-generator/testing-generator';

const fse = require('fs-extra'); 
const fspath = require("path");

export class ComponentTestsGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "tests.template"), "utf-8");

  static resolveMatchSnapshotTemplate(snapshot: ISnapshot){
    const resolved = ["input", "classObject", "mocks", "output"].map((item) => {
      return `expect(snapshot?.${item}).toMatchSnapshot();`;

      // if(JSON.stringify(snapshot[item]).length > 100){
      //   return `expect(snapshot?.${item}).toMatchSnapshot();`;
      // }else{
      //   return `expect(snapshot?.${item}).toMatchInlineSnapshot();`;
      // }
    })

    return resolved.join("\n\t\t");
  }
  static getPath(snapshot: ISnapshot, folderName="default"): string{
    return `./${snapshotDirectory}/${snapshot.className}/${snapshot.functionName}/${folderName}/${snapshot.functionName}.test.tsx`;
  }
}

