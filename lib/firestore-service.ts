import firebase from 'firebase';
import {ISnapshot} from './snapshot';
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

export class FirestoreSevice {
  static flattenSnapshot(snapshot: ISnapshot){
    return {
      ...snapshot,
      classObject: JSON.stringify(snapshot.classObject),
      classObjectAfter: JSON.stringify(snapshot.classObjectAfter),
      input: JSON.stringify(snapshot.input),
      inputAfter: JSON.stringify(snapshot.inputAfter),
      output: JSON.stringify(snapshot.output ?? null),
      caller: JSON.stringify(snapshot.caller ?? null),
      callerId: JSON.stringify(snapshot.callerId ?? null),
      mocks: JSON.stringify(snapshot.mocks)
    }
  }
  static buildSnapshot(data: any){
    return {
      ...data,
      classObject: JSON.parse(data.classObject),
      classObjectAfter: JSON.parse(data.classObjectAfter),
      input:  JSON.parse(data.input),
      inputAfter:  JSON.parse(data.inputAfter),
      output:  JSON.parse(data.output),
      caller: JSON.parse(data.caller),
      callerId: JSON.parse(data.callerId),
      mocks: JSON.parse(data.mocks)
    }
  }
  static async put(snapshot: ISnapshot){
    const existingSnapshots: any[] = await lock.acquire(`${snapshot.className}.${snapshot.functionName}`, () => {
      return this.get(snapshot.className, snapshot.functionName);
    });
    if(existingSnapshots.length == 0){
      return this.post(snapshot);
    }

    snapshot.creationTime = new Date().valueOf();
    const snapshotObj = this.flattenSnapshot(snapshot);
    
    console.log(`put snapshot: ${snapshot.className}.${snapshot.functionName}`);
    return await firebase.firestore()
      .collection('snapshots')
      .doc(existingSnapshots[0].id)
      .set(snapshotObj)
      .then((response)=>{
        // console.log(`${snapshot.className}.${snapshot.functionName} updated to firestore`);
      });
  }
  static async post(snapshot: ISnapshot){
    snapshot.creationTime = new Date().valueOf();
    const snapshotObj = this.flattenSnapshot(snapshot);
    
    console.log(`post snapshot: ${snapshot.className}.${snapshot.functionName}`);
    return await firebase.firestore()
      .collection('snapshots')
      .add(snapshotObj)
      .then((response)=>{
        // console.log(`${snapshot.className}.${snapshot.functionName} added to firestore`);
      })
      .catch(err => console.error("FirestoreSevice.post: ", err));
  }
  static get(className: string | undefined, functionName: string){
    return new Promise<Object[]>((resolve) => {
      firebase.firestore()
      .collection('snapshots')
      .where("className", "==", className)
      .where("functionName", "==", functionName)
      .orderBy("creationTime", "desc")
      .limit(1)
      .get()
      .then((response)=>{
        let snapshots = response.docs.map((doc)=>{
          const data = doc.data();
          const id = doc.id;
          const snapshot = this.buildSnapshot(data);
          
          return {id, ...snapshot};
        });

        resolve(snapshots);
      })
      .catch(error => console.log(error))
    }) 
  }
}
