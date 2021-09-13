import { AspectInjection } from './aspect-injection';
import { FirestoreSevice } from './firestore-service';
import { SnapshotAspect } from './snapshot-aspect';
import { SnapshotDecorator } from './snapshot-decorator';
import { ISnapshot } from './snapshot';

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