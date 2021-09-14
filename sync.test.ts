import { SyncService } from './lib/features/sync/sync-service';

it('sync with SnapshotService', async () => {
  await SyncService.sync(__dirname);
}, 30000)