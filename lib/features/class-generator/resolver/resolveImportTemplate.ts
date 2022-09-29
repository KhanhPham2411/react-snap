import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { pathExists, readAllText, writeAllText } from '../../../../../util-common/file';
const path = require('path');

export const functionImportTemplate = `
import * as \${this.target} from "../\${this.relative}/\${this.fileName}"`;

export const methodImportTemplate = `
import { \${this.className} } from "../\${this.relative}/\${this.fileName}"`;

export async function resolveFunctionImportTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const relative =  path.relative(config.workspacePath, config.dirname);

  if(snapshot.className) {
    return TestingGenerator.fillTemplate(methodImportTemplate, {
      ...snapshot,
      ...config,
      relative
    });
  }

  return TestingGenerator.fillTemplate(functionImportTemplate, {
    ...snapshot,
    ...config,
    relative
  });
}

export async function insertImportTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const mockFileName = `__lozicode___/mock.ts`;
  const mockFilePath = `${config.workspacePath}/${mockFileName}`;
  if(!pathExists(mockFilePath)) return;

  let mockFileContent = readAllText(mockFilePath);
  const itemTemplate = await resolveFunctionImportTemplate(snapshot, config);
  if(mockFileContent.includes(itemTemplate)) {
    return;
  }

  mockFileContent = `${itemTemplate}\n${mockFileContent}`;
  writeAllText(mockFilePath, mockFileContent);
}
