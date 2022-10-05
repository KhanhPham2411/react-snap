
export class LoggingDecorator {
  aspect: any;
  constructor(){
  }

  descriptor(target, key, descriptor: PropertyDescriptor): PropertyDescriptor{
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      console.log(args);
      return originalMethod.apply(this, args);
    }
  
    return descriptor;
  }
}
