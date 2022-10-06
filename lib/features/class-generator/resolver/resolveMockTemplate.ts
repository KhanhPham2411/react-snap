import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const mockTemplate = `import { mock, init } from './core';

export function mockAll() {
  init();
}
`;

export const methodImportTemplate = `
import { \${this.className} } from "../../\${this.fileName}"`;

export async function resolveMockTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const mockFileName = `__lozicode__/mock.ts`;
  const mockFilePath = `${config.workspacePath}/${mockFileName}`;
  if(!pathExists(mockFilePath)) {
    writeAllText(mockFilePath, mockTemplate)
  }

  await insertImportTemplate(snapshot, config);
  await insertMockItemTemplate(snapshot, config);
}