import { ISnapshot } from "../../../core/snapshot";
import { TestingGeneratorConfig } from "../testing-generator";
import { pathExists, writeAllText } from '../../../../../util-common/file';
import { insertImportTemplate } from './resolveImportTemplate';
import { insertMockItemTemplate } from './resolveMockItemTemplate';
const path = require("path");

export const coreTemplate = `import * as fse from 'fs-extra';

function updateProperties(snapshot: ISnapshot) {
  if(snapshot.creationTime == null) {
    snapshot.creationTime = new Date().getTime();
    snapshot.creationTimeString = new Date(snapshot.creationTime).toLocaleString();
    snapshot.updateTime = snapshot.creationTime;
    snapshot.updateTimeString = snapshot.creationTimeString;
    snapshot.elapsedTime = 0;
    snapshot.numberOfCall = 1;
  }
  else {
    snapshot.updateTime = new Date().getTime();
    snapshot.updateTimeString = new Date(snapshot.updateTime).toLocaleString();
    snapshot.elapsedTime += snapshot.updateTime - snapshot.creationTime;
  }
}

export function init() {
  fse.rmSync('__lozicode__/data/main.json', { force: true });
}

export function mergeMainSnapshot(snapshot: ISnapshot, filePath) {
  let arraySnap: ISnapshot[] = [];
  if(fse.pathExistsSync(filePath)) {
    arraySnap = JSON.parse(fse.readFileSync(filePath, 'utf8'));
  }

  for(let i=0; i<arraySnap.length; i++) {
    if(arraySnap[i].id == snapshot.id) {
      arraySnap[i] = {...snapshot};
      tryOutputFileSync({ filePath, arraySnap });
      return;
    }
  }

  let foundSnap;
  for(let i=0; i<arraySnap.length; i++) {
    if(arraySnap[i].targetName == snapshot.targetName 
      && arraySnap[i].functionName == snapshot.functionName ) {
      foundSnap = i;
      snapshot.elapsedTime += arraySnap[i].elapsedTime;
      snapshot.numberOfCall += arraySnap[i].numberOfCall;
    }
  }

  if(foundSnap != null) {
    arraySnap.splice(foundSnap, 1);
  } 

  arraySnap.unshift(snapshot);
	tryOutputFileSync({ filePath, arraySnap });
}

export function tryOutputFileSync({
  filePath, 
  arraySnap
}) {
  try {
    fse.outputFileSync(filePath, JSON.stringify(arraySnap, null, 2));
  }
  catch {

  }
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
	tryOutputFileSync({ filePath, arraySnap });
}
export function saveSnapshot(snapshot: ISnapshot) {
  const mainPath = \`__lozicode__/data/main.json\`;

  updateProperties(snapshot);
  
	const functionPath = \`__lozicode__/data/\${snapshot.targetName}/\${snapshot.functionName}.json\`;

  mergeSnapshot(snapshot, functionPath);
  mergeMainSnapshot(snapshot, mainPath);
}
export function mock(object, snapshot: ISnapshot) {
  try {
    if(object[snapshot.functionName + "__mocked"]) {
      return;
    }

    const originalSnapshot = {...snapshot};
    const originalMethod = object[snapshot.functionName];
    object[snapshot.functionName + "__mocked"] = originalMethod;

    const isAsync = checkIsAsync(originalMethod);
    let wrapperMethod;

    if(isAsync) {
      wrapperMethod = async (...args) => {
        snapshot = {...originalSnapshot};
        snapshot.input = args;
        snapshot.id = Math.random().toString(16).slice(2);
        saveSnapshot(snapshot);
    
        const output = await originalMethod.apply(this, args);
    
        snapshot.output = output;
        saveSnapshot(snapshot);
        return output;
      }
    } else {
      wrapperMethod = (...args) => {
        snapshot.input = args;
        snapshot.id = Math.random().toString(16).slice(2);
        saveSnapshot(snapshot);
    
        const output = originalMethod.apply(this, args);
    
        snapshot.output = output;
        saveSnapshot(snapshot);
        return output;
      }
    }
  
    jest.spyOn(object, snapshot.functionName).mockImplementation(wrapperMethod);
  } catch{}
}

export function checkIsAsync(func) {
  const string = func.toString().toLowerCase().trim();

  return !!(
    string.match(/await/) ||
    string.match(/async/) ||
      // generator
      string.match(/__generator/) ||
      // native
      string.match(/^async /) ||
      // babel (this may change, but hey...)
      string.match(/return _ref[^\.]*\.apply/)
      // insert your other dirty transpiler check

      // there are other more complex situations that maybe require you to check the return line for a *promise*
  );
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
  updateTime?: number;
  updateTimeString?: string;
  elapsedTime?: number;
  isPrototype?: boolean;
  isCompleted?: boolean;
  mocks?: ISnapshot[];
  mockFunction?: any;
  numberOfCall?: number;
}
`;

export async function resolveCoreTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const coreFileName = `__lozicode__/core.ts`;
  const coreFilePath = `${config.workspacePath}/${coreFileName}`;
  if(!pathExists(coreFilePath)) {
    writeAllText(coreFilePath, coreTemplate)
  }
}