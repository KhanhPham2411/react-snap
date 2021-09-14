import { SyncService } from './lib/features/sync/sync-service';

it('sync with SnapshotService', async () => {
  const config = SyncService.ensureConfig(__dirname);
  console.log(config.namespaces);
}, 30000)