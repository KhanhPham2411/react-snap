import * as config from './config';
import { SyncService } from './lib/features/sync/sync-service';

it('sync with SnapshotService', async () => {
  await SyncService.sync(config)
}, 30000)