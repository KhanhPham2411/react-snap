import { ISnapshot } from "../../core/snapshot";
import { getFuncList, getFunc } from "../../core/utils";
import { functionTemplateString, methodTemplateString } from "./testing-generator-template";
import { resolveMockTemplate } from './resolver/resolveMockTemplate';
import { resolveImportMockTemplate } from './resolver/resolveImportMockTemplate';
import { resolveIgnoreTemplate } from './resolver/resolveIgnoreTemplate';
import { resolveCoreTemplate } from './resolver/resolveCoreTemplate';
import {parseFilepath, getRelativePath} from '../../../../util-common/file';

const fse = require("fs-extra");
const fspath = require("path");

export let snapshotDirectory = "__lozicode__";

export interface TestingGeneratorConfig {
  dirname?: string;
  dirnameRelative?: string;
  snapshotDirectory?: string;
  fileName?: string;
  filePath?: string;
  fileNameFormated?: string;
  workspacePath?: string;
  target?: string;
  matchSnapshot?: string;
  params?: string;
  jestPath?: string;
}
export class TestingGenerator {
  static async generate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
    this.resolveConfigInit(snapshot, config);
   
    await resolveMockTemplate(snapshot, config);
    await resolveCoreTemplate(snapshot, config);
    await resolveIgnoreTemplate(snapshot, config);
    await this.resolveJestTemplate(snapshot, config);

    return  {
      ...config, 
      ...snapshot
    };
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

  static resolveConfigInit(snapshot: ISnapshot, config: TestingGeneratorConfig) {
    if(config.fileName == null) {
      const { dir, name } = parseFilepath({ filePath: config.filePath });
      config.fileName = name.replace(".test", "");
      config.dirname = dir;
    }
    
    config.fileNameFormated = config.fileName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());
    config.target = this.resolveTarget(snapshot, config);
    config.matchSnapshot = this.resolveMatchSnapshotTemplate(snapshot);
    config.params = this.resolveParams(snapshot);
    config.dirnameRelative = getRelativePath({sourcePath: config.workspacePath, targetPath: config.dirname});
  }

  static resolveTarget(snapshot: ISnapshot, config: TestingGeneratorConfig) {
    if(snapshot.targetName) {
      return snapshot.targetName;
    }

    if(snapshot.className) {
      if (snapshot.isPrototype) {
        return `${snapshot.className}.prototype`;
      }
  
      return `${snapshot.className}`;
    }
    
    return config.fileNameFormated;
  }

  static resolveParams(snapshot: ISnapshot) {
    if (snapshot.params == null) {
      return "";
    }

    return snapshot.params.map((i) => i.startsWith("{") ? "{}" : "null").join(", ");
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
      config.workspacePath + `/${config.snapshotDirectory}/test/${config.dirnameRelative}/${config.target}/${this.getFileName(snapshot, config)}`
    );
  }
  static getFileName(snapshot: ISnapshot, config) {
    return `${snapshot.functionName}.test.ts`;
  }
}
