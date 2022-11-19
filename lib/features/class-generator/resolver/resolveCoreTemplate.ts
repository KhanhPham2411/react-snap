import { ISnapshot } from "../../../core/snapshot";
import { TestingGeneratorConfig } from "../testing-generator";
import { pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const coreTemplate = `import * as fse from 'fs-extra';

function updateTime(snapshot: ISnapshot) {
  snapshot.creationTime = new Date().getTime();
  snapshot.creationTimeString = new Date(snapshot.creationTime).toLocaleString();
}

export function init() {
  fse.rmSync('__lozicode__/data/main.json', { force: true });
}

export function mergeMainSnapshot(snapshot: ISnapshot, filePath) {
  let arraySnap = [];
  if(fse.pathExistsSync(filePath)) {
    arraySnap = JSON.parse(fse.readFileSync(filePath, 'utf8'));
  }

  for(let i=0; i<arraySnap.length; i++) {
    if(arraySnap[i].id == snapshot.id) {
      arraySnap[i] = {...snapshot};
      fse.outputFileSync(filePath, JSON.stringify(arraySnap, null, 2));
      return;
    }
  }

  let foundSnap;
  for(let i=0; i<arraySnap.length; i++) {
    if(arraySnap[i].targetName == snapshot.targetName 
      && arraySnap[i].functionName == snapshot.functionName ) {
      foundSnap = i;
    }
  }

  if(foundSnap != null) {
    arraySnap.splice(foundSnap, 1);
  } 

  arraySnap.unshift(snapshot);
	fse.outputFileSync(filePath, JSON.stringify(arraySnap, null, 2));
}

export function mergeSnapshot(snapshot: ISnapshot, filePath) {
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
export function saveSnapshot(snapshot: ISnapshot) {
  const mainPath = \`__lozicode__/data/main.json\`;

  updateTime(snapshot);
  
	const functionPath = \`__lozicode__/data/\${snapshot.targetName}/\${snapshot.functionName}.json\`;

  mergeSnapshot(snapshot, functionPath);
  mergeMainSnapshot(snapshot, mainPath);
}
export function mock(object, snapshot: ISnapshot) {
  try {
    if(object[snapshot.functionName + "__mocked"]) {
      return;
    }

    const originalMethod = object[snapshot.functionName];
    object[snapshot.functionName + "__mocked"] = originalMethod;
    
    const wrapperMethod = async (...args) => {
      snapshot.input = args;
      snapshot.id = Math.random().toString(16).slice(2);
      saveSnapshot(snapshot);
  
      const output = await originalMethod.apply(this, args);
  
      snapshot.output = output;
      saveSnapshot(snapshot);
      return output;
    }
  
    jest.spyOn(object, snapshot.functionName).mockImplementation(wrapperMethod);
  } catch {}
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
}
`;

export async function resolveCoreTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const coreFileName = `__lozicode__/core.ts`;
  const coreFilePath = `${config.workspacePath}/${coreFileName}`;
  if(!pathExists(coreFilePath)) {
    writeAllText(coreFilePath, coreTemplate)
  }
}