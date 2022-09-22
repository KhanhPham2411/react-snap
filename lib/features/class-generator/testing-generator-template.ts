// import * as config from "../../../../react-snap.config";
// import { SnapshotGenerator } from '../../../../react-snap.test';
// import { \${this.className}\${this.functionName}Props } from './\${this.className}.\${this.functionName}.props';

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
const snapshot = {} as any;

describe("\${this.fileNameFormated}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.fileNameFormated}.\${this.functionName}();
    console.log(actualOutput);
  });
})`;
export const methodTemplateString = `
import { \${this.className} } from "../../\${this.fileName}"
const snapshot = {} as any;

describe("\${this.className}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.className}.\${this.functionName}();
    console.log(actualOutput);
  });
})`;
