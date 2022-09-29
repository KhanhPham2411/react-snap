import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';

const path = require("path");

export const mockItemTemplate = `
  mock(\${this.target}, {
    functionName: '\${this.functionName}', targetName: '\${this.target}', priority: 2
  });
`;
export const mockItemIdentityTemplate = `functionName: '\${this.functionName}', targetName: '\${this.target}'`;


export async function resolveMockItemTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  return TestingGenerator.fillTemplate(mockItemTemplate, {
    ...snapshot,
    ...config
  });
}
export async function resolveMockItemIdentityTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  return TestingGenerator.fillTemplate(mockItemIdentityTemplate, {
    ...snapshot,
    ...config
  });
}

export async function insertMockItemTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const mockFileName = `__lozicode___/mock.ts`;
  const mockFilePath = `${config.workspacePath}/${mockFileName}`;
  if(!pathExists(mockFilePath)) return;

  let mockFileContent = readAllText(mockFilePath);
  const itemTemplate = await resolveMockItemTemplate(snapshot, config);
  const identityTemplate = await resolveMockItemIdentityTemplate(snapshot, config);
  if(mockFileContent.includes(identityTemplate)) {
    return;
  }

  mockFileContent = mockFileContent.replace('mockAll() {', `mockAll() {${itemTemplate}`);
  writeAllText(mockFilePath, mockFileContent);
}