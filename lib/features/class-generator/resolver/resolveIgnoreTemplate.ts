import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { readAllText, fse, pathExists, writeAllText } from '../../../../../util-common/file';

const path = require("path");

export const ignoreTemplate = `data/`;

export async function resolveIgnoreTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const ignoreFileName = `__lozicode__/.gitignore`;
  const ignoreFilePath = `${config.workspacePath}/${ignoreFileName}`;
  if(!pathExists(ignoreFilePath)) {
    writeAllText(ignoreFilePath, ignoreTemplate)
  }
}