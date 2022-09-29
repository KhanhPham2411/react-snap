import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
const path = require('path');

export const functionImportTemplate = `
import * as \${this.targetName} from "../\${this.relative}/\${this.fileName}"`;

export const methodImportTemplate = `
import { \${this.className} } from "../../\${this.fileName}"`;

export async function resolveFunctionImportTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
   const relative =  path.relative(config.workspacePath, config.dirname);

    console.log(relative);
  return TestingGenerator.fillTemplate(functionImportTemplate, {
    ...snapshot,
    ...config,
    relative
  });
}
