import { ISnapshot } from "../../../core/snapshot";
import { TestingGenerator, TestingGeneratorConfig } from "../testing-generator";
import { pathExists, readAllText, writeAllText, getRelativePath, dirname } from '../../../../../util-common/file';
const path = require('path');

export const importMockTemplate = `import { mockAll } from '\${this.relative}/__lozicode__/mock';

mockAll();`;

export async function resolveImportMockTemplate(snapshot: ISnapshot, config: TestingGeneratorConfig) {
  const relative = getRelativePath({sourcePath: dirname(config.jestPath), targetPath: config.workspacePath})

  return TestingGenerator.fillTemplate(importMockTemplate, {
    ...snapshot,
    ...config,
    relative
  });
}