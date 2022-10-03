import { ISnapshot } from "../../core/snapshot";
import { getFuncList, getFunc } from "../../core/utils";
import { functionTemplateString, methodTemplateString } from "./testing-generator-template";
import { resolveMockTemplate } from './resolver/resolveMockTemplate';
import { resolveImportMockTemplate } from './resolver/resolveImportMockTemplate';
import { resolveIgnoreTemplate } from './resolver/resolveIgnoreTemplate';

const fse = require("fs-extra");
const fspath = require("path");

export let snapshotDirectory = "__react-snap__";

export interface TestingGeneratorConfig {
  dirname: string;
  snapshotDirectory: string;
  fileName: string;
  fileNameFormated?: string;
  workspacePath?: string;
  target?: string;
  matchSnapshot?: string;
  params?: string;
  jestPath?: string;
}
export class TestingGenerator {
  static async generate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
    config.fileNameFormated = config.fileName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());
    config.target = this.resolveTarget(snapshot, config);
    config.matchSnapshot = this.resolveMatchSnapshotTemplate(snapshot);
    config.params = this.resolveParams(snapshot);

    await resolveMockTemplate(snapshot, config);
    await resolveIgnoreTemplate(snapshot, config);
    await this.resolveJestTemplate(snapshot, config);

    return config.jestPath;
  }
  static async resolveJestTemplate(snapshot: ISnapshot, config) {
    config.jestPath = this.getJestPath(snapshot, config);
    config.importMock = await resolveImportMockTemplate(snapshot, config);
    
    if (fse.pathExistsSync(config.jestPath)) {
      return;
    }

    let resolvedTemplate: string;
    if (snapshot.className) {
      resolvedTemplate =  this.fillTemplate(methodTemplateString, {
        ...snapshot,
        ...config,
      });
    }else {
      resolvedTemplate =  this.fillTemplate(functionTemplateString, {
        ...snapshot,
        ...config,
      });
    }

    fse.outputFileSync(config.jestPath, resolvedTemplate);
    return;
  }

  static resolveTarget(snapshot: ISnapshot, config: TestingGeneratorConfig) {
    if(snapshot.className) {
      if (snapshot.isPrototype) {
        return `${snapshot.targetName}.prototype`;
      }
  
      return `${snapshot.targetName}`;
    }
    
    return config.fileNameFormated;
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

  static getJestPath(snapshot: ISnapshot, config): string {
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
