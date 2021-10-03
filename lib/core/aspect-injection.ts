import { SnapshotDecorator } from './snapshot-decorator';
import { getMethods, original_descriptor_predefined } from './utils';

export class AspectInjection {
  static inject(target, aspect) {
    target.isPrototype = false;
    this.injectMethods(target, aspect);

    const prototype = target.prototype;
    if(prototype){
      prototype.name = target.name;
      prototype.isPrototype = true;
      this.injectMethods(prototype, aspect);
    }
  }
  static injectMethods(target, aspect) {
    const methods = getMethods(target);
    methods.forEach((key) => {
      const sourceDescriptor = Object.getOwnPropertyDescriptor(target, key);
      if(!target[`${original_descriptor_predefined}${key}`]){
        target[`${original_descriptor_predefined}${key}`] = sourceDescriptor?.value;
      }else{
        return;
      }

      const decorator = new SnapshotDecorator(aspect);
      sourceDescriptor? Object.defineProperty(target, key, decorator.descriptor(target, key, sourceDescriptor)): null;
    });
  }
  static clear(target) {
    const prototype = target.prototype;
    prototype.name = target.name;

    this.clearMethods(target);
    this.clearMethods(prototype);
  }
  static clearMethods(target) {
    const methods = getMethods(target);
    methods.forEach((key) => {
      if(target[`${original_descriptor_predefined}${key}`]){
        const sourceDescriptor = Object.getOwnPropertyDescriptor(target, key);
        const original_descriptor = (target, key, descriptor) => {
          descriptor.value = target[`${original_descriptor_predefined}${key}`];
          return descriptor;
        }
        Object.defineProperty(target, key, original_descriptor(target, key, sourceDescriptor));

        target[`${original_descriptor_predefined}${key}`] = null;
      }
    });
  }
};
