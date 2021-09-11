import { AspectInjection } from './aspect-injection';
import { FirestoreSevice } from './firestore-service';
import { SnapshotAspect } from './snapshot-aspect';
import { SnapshotDecorator } from './snapshot-decorator';
import { ISnapshot } from './snapshot';

import * as mockFeature from './features/mock-generator';
mockFeature.init();

export {
  AspectInjection,
  FirestoreSevice,
  SnapshotAspect,
  SnapshotDecorator,
  ISnapshot,
}