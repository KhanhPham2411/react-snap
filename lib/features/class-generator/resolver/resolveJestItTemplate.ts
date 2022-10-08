import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { pathExists, readAllText, writeAllText, getRelativePath } from '../../../../../util-common/file';
import { insert } from '../../../../../util-common/string';
const path = require('path');

export const jestItTemplate = `it("\${this.creationTimeString} - \${this.id}", async () => {
    const actualOutput = await \${this.target}.\${this.functionName}(\${this.inputParams});
    console.log(actualOutput);

    expect(actualOutput).toBe(\${this.output});
  });
  
  `;

export async function resolveJestItTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  snapshot.creationTimeString = new Date(snapshot.creationTime).toLocaleString();
  TestingGenerator.resolveConfigInit(snapshot, config);
  const inputParams = snapshot.input.join(", ");

  return TestingGenerator.fillTemplate(jestItTemplate, {
    ...snapshot,
    ...config,
    inputParams
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
