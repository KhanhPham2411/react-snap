import { SyncService } from './lib/features/component-generator/sync/sync-service';
import { SnapshotService } from './lib/features/class-generator/snapshot-service';

it('sync with SnapshotService', async () => {
  await SyncService.sync(__dirname);
}, 30000)

export {
  SnapshotService,
  SyncService
}