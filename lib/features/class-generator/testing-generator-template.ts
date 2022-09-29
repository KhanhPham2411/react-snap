// import * as config from "../../../../react-snap.config";
// import { SnapshotGenerator } from '../../../../react-snap.test';
// import { \${this.className}\${this.functionName}Props } from './\${this.className}.\${this.functionName}.props';
// const snapshot = {} as any;
//const { namespaces } = config;
//const { \${this.className} } = namespaces;
//const snapshot = \${this.className}\${this.functionName}Props;

// \${this.matchSnapshot}
// SnapshotGenerator.resolveMockMethods(snapshot as any, namespaces);

// expect(actualOutput).toMatchSnapshot();
// if(snapshot?.output !== null){
//   expect(actualOutput).toEqual(snapshot?.output);
// }

export const functionTemplateString = `
import * as \${this.fileNameFormated} from "../../\${this.fileName}"


describe("\${this.fileNameFormated}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.fileNameFormated}.\${this.functionName}(\${this.params});
    console.log(actualOutput);
  });
})`;
export const methodTemplateString = `
import { \${this.className} } from "../../\${this.fileName}"
const snapshot = {} as any;

describe("\${this.className}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.target}.\${this.functionName}(\${this.params});
    console.log(actualOutput);
  });
})`;

export const methodImportTemplate = `
import { \${this.className} } from "../../\${this.fileName}"`;

export const mockTemplate = `
\${this.imports}
export const fse = require("fs-extra");

export function saveSnapshot(snapshot: ISnapshot) {
	const filePath = \`__lozicode__/\${snapshot.targetName}/\${snapshot.functionName}.json\`;
	fse.outputFileSync(filePath, JSON.stringify(snapshot));
}
export function mock(object, method, targetName) {
	const originalMethod = object[method];
	const wrapperMethod = async (...args) => {
		const snapshot = {
			input: args,
			priority: 2,
			functionName: method,
			targetName
		} as ISnapshot
		saveSnapshot(snapshot);
		const output = await originalMethod.apply(this, args);

		snapshot.output = output;
		snapshot.priority = 1;
		saveSnapshot(snapshot);
		return output;
	}

	jest.spyOn(object, method).mockImplementation(wrapperMethod);
}

export function mockAll() {
	mock(devide, 'devide', 'devide');
  \${this.mockAll}
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
}`;
