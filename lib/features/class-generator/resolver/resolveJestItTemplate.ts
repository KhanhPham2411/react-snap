import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { pathExists, readAllText, writeAllText, getRelativePath } from '../../../../../util-common/file';
import { insert } from '../../../../../util-common/string';
const path = require('path');

export const jestItTemplate = `it("\${this.creationTimeString} - \${this.id} - \${this.elapsedTimeString} ms", async () => {
    const actualOutput = await \${this.target}.\${this.functionName}(\${this.inputParams});
    console.log(actualOutput);
    writeFileSync({
      dirname: __dirname,
      filename: 'actualOutput_\${this.id}_\${this.creationTimeString}',
      value: actualOutput,
    });

    expect(actualOutput).toBe(\${this.outputJson});
  });
  
  `;

export async function resolveJestItTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  snapshot.creationTimeString = new Date(snapshot.creationTime).toLocaleString();
  snapshot.elapsedTimeString = snapshot.elapsedTime.toLocaleString();
  
  TestingGenerator.resolveConfigInit(snapshot, config);
  const inputParams = snapshot.input.map(item => JSON.stringify(item, null, 2)).join(", ");
  const outputJson = JSON.stringify(snapshot.output, null, 2);

  return TestingGenerator.fillTemplate(jestItTemplate, {
    ...snapshot,
    ...config,
    inputParams,
    outputJson
  });
}

export async function insertJestItTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig, insertIndex: number = null) {
  const jestFilePath = config.filePath;
  if(!pathExists(jestFilePath)) return;
  

  let jestFileContent = readAllText(jestFilePath);
  const itemTemplate = await resolveJestItTemplate(snapshot, config);

  if(insertIndex == null) {
    insertIndex = jestFileContent.indexOf('it(');
  }
  if(insertIndex == null) return;
  
  const newContent = insert(jestFileContent, insertIndex, itemTemplate);
  
  writeAllText(jestFilePath, newContent);
}
