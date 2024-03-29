import { ISnapshot } from "../../core/snapshot";
import { snapshotDirectory } from "./snapshot-generator";
import { getFuncList, getFunc } from "../../core/utils";
import { TestingGenerator } from "./testing-generator";

const fse = require("fs-extra");
const fspath = require("path");

export class StoryGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "story-generator.template"), "utf-8");

  static resolveTemplate(templateString, snapshot: ISnapshot, config) {
    const target = this.resolveTarget(snapshot);
    const path = this.getJestPath(snapshot, config);

    return this.fillTemplate(templateString, {
      ...snapshot,
      target,
      path,
    });
  }

  static resolveTarget(snapshot: ISnapshot) {
    if (snapshot.isPrototype) {
      return `${snapshot.targetName}.prototype`;
    }

    return `${snapshot.targetName}`;
  }

  static getFileName(snapshot: ISnapshot) {
    return `${snapshot.targetName}.${snapshot.functionName}.stories.ts`;
  }
}
