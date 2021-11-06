import { SyncService } from './lib/features/sync/sync-service';
import { SnapshotGenerator } from './lib/features/class-generator/snapshot-generator';

it('sync with SnapshotService', async () => {
  await SyncService.sync(__dirname);
}, 30000)

export {
  SnapshotGenerator,
  SyncService
}