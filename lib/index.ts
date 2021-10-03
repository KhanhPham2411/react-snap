import { AspectInjection } from './core/aspect-injection';
import { FirestoreSevice } from './core/firestore-service';
import { SnapshotAspect } from './core/snapshot-aspect';
import { SnapshotDecorator } from './core/snapshot-decorator';
import { ISnapshot } from './core/snapshot';

import * as mockHandler from './features/mock-generator/mock-handler';
import * as componentHandler from './features/component-generator/component-handler';

mockHandler.register();
componentHandler.register();

export {
  AspectInjection,
  FirestoreSevice,
  SnapshotAspect,
  SnapshotDecorator,
  ISnapshot,
}