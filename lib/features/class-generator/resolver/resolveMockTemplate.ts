import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const mockTemplate = `export const fse = require("fs-extra");

export function saveSnapshot(snapshot: ISnapshot) {
	const filePath = \`__lozicode__/\${snapshot.targetName}/\${snapshot.functionName}.json\`;
	fse.outputFileSync(filePath, JSON.stringify(snapshot));
}
export function mock(object, snapshot: ISnapshot) {
	const originalMethod = object[snapshot.functionName];
	const wrapperMethod = async (...args) => {
		snapshot.input = args;
		saveSnapshot(snapshot);

		const output = await originalMethod.apply(this, args);

		snapshot.output = output;
		snapshot.priority = 1;
		saveSnapshot(snapshot);
		return output;
	}

	jest.spyOn(object, snapshot.functionName).mockImplementation(wrapperMethod);
}

export function mockAll() {
}`;

export const methodImportTemplate = `
import { \${this.className} } from "../../\${this.fileName}"`;

export async function resolveMockTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const mockFileName = `__lozicode___/mock.ts`;
  const mockFilePath = `${config.workspacePath}/${mockFileName}`;
  if(!pathExists(mockFilePath)) {
    writeAllText(mockFilePath, mockTemplate)
  }

  await insertImportTemplate(snapshot, config);
  await insertMockItemTemplate(snapshot, config);
}