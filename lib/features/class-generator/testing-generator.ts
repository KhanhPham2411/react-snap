import { ISnapshot } from "../../core/snapshot";
import { getFuncList, getFunc } from "../../core/utils";
import { functionTemplateString, methodTemplateString } from "./testing-generator-template";

const fse = require("fs-extra");
const fspath = require("path");

export let snapshotDirectory = "__react-snap__";

export interface TestingGeneratorConfig {
  dirname: string;
  snapshotDirectory: string;
  fileName: string;
  fileNameFormated?: string;
  workspacePath?: string;
}
export class TestingGenerator {
  static generate(snapshot: ISnapshot, config: TestingGeneratorConfig, update = false) {
    config.fileNameFormated = config.fileName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

    const testPath = this.getPath(snapshot, config);
    if (fse.pathExistsSync(testPath) && update === false) {
      return testPath;
    }

    const resolvedTemplate = this.resolveTemplate(snapshot, config);
    fse.outputFileSync(testPath, resolvedTemplate);

    return testPath;
  }
  static resolveTemplate(snapshot: ISnapshot, config) {
    const matchSnapshot = this.resolveMatchSnapshotTemplate(snapshot);
    const target = this.resolveTarget(snapshot);
    const params = this.resolveParams(snapshot);
    if (snapshot.targetName) {
      return this.fillTemplate(methodTemplateString, {
        ...snapshot,
        ...config,
        // matchSnapshot,
        target,
        params,
      });
    }

    return this.fillTemplate(functionTemplateString, {
      ...snapshot,
      ...config,
      // matchSnapshot,
      target,
      params,
    });
  }

  static resolveTarget(snapshot: ISnapshot) {
    if (snapshot.isPrototype) {
      return `${snapshot.targetName}.prototype`;
    }

    return `${snapshot.targetName}`;
  }

  static resolveImports(snapshot: ISnapshot) {
    return `import * as devide from '../src/devide';`;
  }

  static resolveParams(snapshot: ISnapshot) {
    if (snapshot.params == null) {
      return "";
    }
    return snapshot.params.map((i) => "null").join(",");
  }

  static resolveMatchSnapshotTemplate(snapshot: ISnapshot) {
    const resolved = ["input", "classObject", "mocks", "output"].map((item) => {
      return `expect(snapshot?.${item}).toMatchSnapshot();`;

      // if(JSON.stringify(snapshot[item]).length > 100){
      //   return `expect(snapshot?.${item}).toMatchSnapshot();`;
      // }else{
      //   return `expect(snapshot?.${item}).toMatchInlineSnapshot();`;
      // }
    });

    return resolved.join("\n\t\t");
  }

  static fillTemplate(templateString, templateVars) {
    return new Function("return `" + templateString + "`;").call(templateVars);
  }

  static getPath(snapshot: ISnapshot, config, folderName = "default"): string {
    if (config.snapshotDirectory == null) {
      config.snapshotDirectory = snapshotDirectory;
    }
    return (
      config.dirname + `/${config.snapshotDirectory}/${config.fileNameFormated}/${this.getFileName(snapshot, config)}`
    );
  }
  static getFileName(snapshot: ISnapshot, config) {
    return `${snapshot.functionName}.test.ts`;
  }
}
