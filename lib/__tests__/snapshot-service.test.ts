import {SnapshotGenerator} from '../features/class-generator/snapshot-generator';
const fse = require('fs-extra')

jest.mock('../firestore-service.ts');
jest.mock('fs-extra');

describe("SnapshotService", () => {
  it("fetch should call readSnapshotFile when path exists and update=false", async ()=> {
    const className = "classTest";
    const functionName = "functionTest";
    
    fse.pathExistsSync.mockReturnValue(true);
    jest.spyOn(SnapshotGenerator, 'readSnapshotFile');

    await SnapshotGenerator.fetch(className, functionName, {__dirname});

    expect(SnapshotGenerator.readSnapshotFile).toHaveBeenCalled();
  });
});
