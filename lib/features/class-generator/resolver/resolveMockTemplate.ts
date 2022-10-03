import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const mockTemplate = `import * as fse from "fs-extra";

export function saveSnapshot(snapshot: ISnapshot) {
	const filePath = \`__lozicode__/data/\${snapshot.targetName}/\${snapshot.functionName}.json\`;
  let arraySnap = [];
  if(fse.pathExistsSync(filePath)) {
    arraySnap = JSON.parse(fse.readFileSync(filePath, 'utf8'));
  }

  let foundSnap;
  for(let i=0; i<arraySnap.length; i++) {
    if(arraySnap[i].id == snapshot.id) {
      arraySnap[i] = {...snapshot};
      foundSnap = arraySnap[i];
    }
  }
  if(foundSnap == null) {
    arraySnap.unshift(snapshot);
  }

  if(arraySnap.length > 10) {
    arraySnap.pop();
  }
	fse.outputFileSync(filePath, JSON.stringify(arraySnap, null, 2));
}
export function mock(object, snapshot: ISnapshot) {
	const originalMethod = object[snapshot.functionName];
	const wrapperMethod = async (...args) => {
		snapshot.input = args;
    snapshot.id = Math.random().toString(16).slice(2);
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
}
export interface ISnapshot {
  eval?: any;
  id?: string;
  targetName?: string;
  functionName?: string;
  functionId?: string;
  callerId?: string;
  classObject?: any;
  classObjectAfter?: any;
  input?: any[];
  inputAfter?: any[];
  output?: any;
  creationTime?: number;
  creationTimeString?: string;
  elapsedTime?: number;
  isPrototype?: boolean;
  isCompleted?: boolean;
  mocks?: ISnapshot[];
  mockFunction?: any;
  priority: number;
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