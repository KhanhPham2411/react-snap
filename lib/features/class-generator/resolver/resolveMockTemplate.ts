import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const mockTemplate = `import { mock, init } from './core';
import fs from 'fs';
import path from 'path';

export function mockAll() {
  init();
}

export function writeFileSync({ dirname, filename, value }) {
  const filePath = path.join(dirname, filename);
  const jsonValue = JSON.stringify(value);
  fs.writeFileSync(filePath, jsonValue);

  if (typeof value === 'string') {
    fs.writeFileSync(filePath + '.html', value);
  } else {
    fs.writeFileSync(filePath + '.json', jsonValue);
  }
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