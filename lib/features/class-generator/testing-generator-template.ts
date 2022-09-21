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

export const templateString = `
import * as \${this.fileNameFormated} from "../../\${this.fileName}"
const snapshot = {} as any;

describe("\${this.fileNameFormated}.\${this.functionName}", () =>  {
  it("default", async () => {
    const actualOutput = await \${this.fileNameFormated}.\${this.functionName}.apply(
      snapshot?.classObject,
      snapshot?.input as any
    );
    console.log(actualOutput);
  });
})`;
