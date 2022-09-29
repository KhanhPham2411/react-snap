import { ISnapshot } from "./snapshot";
import { AspectInjection } from "./aspect-injection";
import { FirestoreSevice } from "./firestore-service";
import { SnapshotDecorator } from "./snapshot-decorator";

export class SnapshotAspect {
  static excludedToSync = {};
  static value(snapshot: ISnapshot) {
    const excludedToSyncClasses = Object.getOwnPropertyNames(SnapshotAspect.excludedToSync);
    if (excludedToSyncClasses.filter((item) => item === snapshot.targetName).length === 0) {
      FirestoreSevice.put(snapshot);
    }
  }
  static inject(target) {
    AspectInjection.inject(target, this.value);
  }

  static descriptor() {
    const decorator = new SnapshotDecorator(SnapshotAspect.value);
    return decorator.descriptor;
  }
}
