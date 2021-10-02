import { ISnapshot, ICaller } from './snapshot';
import { getProperties, generateUniqueId, original_function_predefined } from './utils';
import renderer from 'react-test-renderer';

const EventEmitter =require('events');

export const snapshotEmitter = new EventEmitter();

export function checkIsAsync(func) {
  const string = func.toString().toLowerCase().trim();

  return !!(
    string.match(/async/) ||
      // native
      string.match(/^async /) ||
      // babel (this may change, but hey...)
      string.match(/return _ref[^\.]*\.apply/)
      // insert your other dirty transpiler check

      // there are other more complex situations that maybe require you to check the return line for a *promise*
  );
}

export function clone(object){
  if(!object){
    return null;
  }
  if(object.$$typeof && String(object.$$typeof) === 'Symbol(react.element)'){
    // object = {
    //   ...object,
    //   _owner: null,
    //   props: null
    // }
    return renderer.create(object).toJSON();
  }
  
  let stringifyObj = "";
  try{
    stringifyObj = JSON.stringify(object,function(key, value){
      return (typeof value === 'function' ) ? original_function_predefined : value;
    });
  }catch{
    debugger;
  }
  
  if(stringifyObj){
    return JSON.parse(stringifyObj);
  }
  const properties = getProperties(object);
  const newObj = {};

  properties.forEach(item => {
    newObj[item] = object[item];
  });

  return clone(newObj);
}
export class SnapshotDecorator {
  aspect: any;
  constructor(aspect){
    this.aspect = aspect;
  }

  descriptor(target, key, descriptor: PropertyDescriptor): PropertyDescriptor{
    const accessor = descriptor.value ? "value" : "get";
    const original = descriptor[accessor];
    const self = this;
    const isAsync = checkIsAsync(original);

    if (typeof original === 'function') {
      if(isAsync){
        descriptor[accessor] = function(...args) {
          try {
            const descriptorValue = this;
            const snapshotBefore = 
              self._getSnapshotBefore(target, args, original, descriptorValue, key) as ISnapshot;

            return new Promise((resolve) => {
              const tmp = {};
              tmp[snapshotBefore.functionId] = () => {
                let appliedFunc = original;
                if(snapshotBefore.mockFunction){
                  descriptorValue["eval"] = snapshotBefore.eval;
                  appliedFunc = snapshotBefore.mockFunction;
                }
                
                appliedFunc.apply(descriptorValue, args).then((result) => {
                  if(result){
                    result = result.value??result;
                  }
                  
                  const snapshotAfter = self._getSnapshotAfter(snapshotBefore, args, result, original, descriptorValue);
                  self.aspect(snapshotAfter);
    
                  resolve(result);
                });
              };

              tmp[snapshotBefore.functionId]();
            })
          } catch (e) {
            console.log(`Error: ${e}`);
            throw e;
          }
        }
      }
      else{
        descriptor[accessor] = function(...args) {
          try {

            const snapshotBefore = self._getSnapshotBefore(target, args, original, this, key);

            const tmp = {};
            let result = {};
            tmp[snapshotBefore.functionId] = () => {
              result = original.apply(this, args);
            };
            tmp[snapshotBefore.functionId]();

            const snapshotAfter = self._getSnapshotAfter(snapshotBefore, args, result, original, this);
            self.aspect(snapshotAfter);

            return result;
          } catch (e) {
            console.log(`Error: ${e}`);
            throw e;
          }
        }
      }
    }

    descriptor.configurable = accessor == "get";
    return descriptor;
  }

  private _getId(){
    let functionId = generateUniqueId();
    functionId = `__functionId__${functionId}__functionId__`;

    Error.stackTraceLimit = 20;
    const stacks = new Error().stack?.split('__functionId__') as string[];
    let callerId = stacks[1] as any;
    callerId = callerId ? `__functionId__${callerId}__functionId__` : undefined;

    return {functionId, callerId};
  }
  private _getSnapshotBefore(target: any, args: any[], originalFunc: any, descriptorSelf: any,  key: any) {
    const creationTime = new Date().valueOf();

    const {functionId, callerId} = this._getId();

    const snapshotBefore = {
      input: clone(args),
      classObject: clone(descriptorSelf),
      creationTime,
      creationTimeString: new Date(creationTime).toUTCString(),
      functionName: key,
      isPrototype: target.isPrototype,
      className: target.name,
      functionId,
      callerId
    };
    
    snapshotEmitter.emit("onSnapshotBefore", snapshotBefore, originalFunc, target, descriptorSelf);
    return snapshotBefore;
  }
  private _getSnapshotAfter(snapshotBefore: any, args: any[], result: any, originalFunc: any, descriptorSelf: any) {
    const creationTime = new Date().valueOf();
    const elapsedTime: number = creationTime - snapshotBefore.creationTime;
    const snapshotAfter: ISnapshot = {
      ...snapshotBefore,
      classObjectAfter: clone(descriptorSelf),
      inputAfter: clone(args),
      output: clone(result),
      elapsedTime: elapsedTime,
    };
    snapshotEmitter.emit("onSnapshotAfter", snapshotAfter, originalFunc);
    return snapshotAfter;
  }
}
