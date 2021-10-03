import { ISnapshot } from '../../../snapshot';
import { snapshotDirectory } from '../../class-generator/snapshot-service';
import { TestingGenerator } from '../../class-generator/testing-generator';

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
  static getFileName(snapshot: ISnapshot): string{
    return `${snapshot.functionName}.test.tsx`;
  }
}

