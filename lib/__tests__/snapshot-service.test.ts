import {SnapshotService} from '../features/class-generator/snapshot-service';
const fse = require('fs-extra')

jest.mock('../firestore-service.ts');
jest.mock('fs-extra');

describe("SnapshotService", () => {
  it("fetch should call readSnapshotFile when path exists and update=false", async ()=> {
    const className = "classTest";
    const functionName = "functionTest";
    
    fse.pathExistsSync.mockReturnValue(true);
    jest.spyOn(SnapshotService, 'readSnapshotFile');

    await SnapshotService.fetch(className, functionName, {__dirname});

    expect(SnapshotService.readSnapshotFile).toHaveBeenCalled();
  });
});
