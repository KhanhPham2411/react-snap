import { ISnapshot } from "../../core/snapshot";
import { getFuncList, getFunc } from "../../core/utils";
import { templateString } from "./testing-generator-template";

const fse = require("fs-extra");
const fspath = require("path");

export let snapshotDirectory = "__react-snap__";

export class TestingGenerator {
  static get templateString() {
    return templateString;
  }
  static generate(snapshot: ISnapshot, config, update = false) {
    config.fileNameFormated = config.fileName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

    const testPath = this.getPath(snapshot, config);
    if (fse.pathExistsSync(testPath) && update === false) {
      return testPath;
    }

    const resolvedTemplate = this.resolveTemplate(this.templateString, snapshot, config);
    fse.outputFileSync(testPath, resolvedTemplate);

    return testPath;
  }
  static resolveTemplate(templateString, snapshot: ISnapshot, config) {
    const matchSnapshot = this.resolveMatchSnapshotTemplate(snapshot);
    const target = this.resolveTarget(snapshot);

    return this.fillTemplate(templateString, {
      ...snapshot,
      ...config,
      // matchSnapshot,
      target,
    });
  }

  static resolveTarget(snapshot: ISnapshot) {
    if (snapshot.isPrototype) {
      return `${snapshot.className}.prototype`;
    }

    return `${snapshot.className}`;
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
