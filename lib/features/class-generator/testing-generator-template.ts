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
\${this.importMock}

describe("\${this.fileNameFormated}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.fileNameFormated}.\${this.functionName}(\${this.params});
    console.log(actualOutput);
  });
})`;
export const methodTemplateString = `
import { \${this.className} } from "../../\${this.fileName}"
\${this.importMock}

describe("\${this.className}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.target}.\${this.functionName}(\${this.params});
    console.log(actualOutput);
  });
})`;
