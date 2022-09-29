import * as resolveFunctionImportTemplate from "../../resolveImportTemplate";
import { snapshotDirectory } from "../../../snapshot-generator";

describe("resolveFunctionImportTemplate.resolveFunctionImportTemplate", () => {
  it("default", async () => {
    const actualOutput = await resolveFunctionImportTemplate.resolveFunctionImportTemplate(
      {
        input: [9, 3],
        priority: 2,
        functionName: "devide",
        targetName: "devide",
      },
      {
        dirname: "E:/Personal/Projects/20220609_EverAutomation/EverAutomation/src",
        workspacePath: "E:/Personal/Projects/20220609_EverAutomation/EverAutomation",
        snapshotDirectory: "__lozicode__",
        fileName: "devide.ts",
      }
    );
    console.log(actualOutput);
  });
});
