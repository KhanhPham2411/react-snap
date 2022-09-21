export const templateString = `import * as config from "../../../../react-snap.config";
import { SnapshotGenerator } from '../../../../react-snap.test';
import { \${this.className}\${this.functionName}Props } from './\${this.className}.\${this.functionName}.props';

const { namespaces } = config;
const { \${this.className} } = namespaces;
const snapshot = \${this.className}\${this.functionName}Props;

describe("\${this.className}.\${this.functionName}", () =>  {
  it("default", async () => {
    \${this.matchSnapshot}

    SnapshotGenerator.resolveMockMethods(snapshot as any, namespaces);
    
    const actualOutput = await \${this.target}.\${this.functionName}.apply(
      snapshot?.classObject,
      snapshot?.input as any
    );
    expect(actualOutput).toMatchSnapshot();
    if(snapshot?.output !== null){
      expect(actualOutput).toEqual(snapshot?.output);
    }
  });
})`;
