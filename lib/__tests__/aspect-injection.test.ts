import {AspectInjection} from '../core/aspect-injection';
import {ISnapshot} from '../core/snapshot';

describe("aspect injection should work :))", () => {
  class MyBussinessLogic {
    plus = 2;
    add(a: number, b) {
      this.plus = 2;
      const result = a + b + this.plus
      this.plus = 1;
      return result;
    }
    async addAsync(a, b) {
      return this.add(a, b);
    }
    power(a, b) {
      return a ** b + this.plus;
    }
  }
  it("add function shoud have aspect injected", async () => {
    function loggingAspect(snapshot: ISnapshot) {
      expect(snapshot.className).toEqual("MyBussinessLogic");
      expect(snapshot.output).toEqual(4);
      expect(snapshot.classObjectAfter.plus).toEqual(1);
      expect(snapshot.isPrototype).toEqual(true);

      console.log(`Calling the  function: ${ snapshot.functionName}`);
      console.log(`Arguments received: ${ snapshot.input }`);
    }
  
    AspectInjection.inject(MyBussinessLogic, loggingAspect);
    
    const logic = new MyBussinessLogic();
    const resultAsync = await logic.addAsync(1,1);
    expect(resultAsync).toEqual(4);

    const result = logic.add(1,1);
    expect(result).toEqual(4);
    AspectInjection.clear(MyBussinessLogic);
    logic.power(3,2); // make sure aop clear, if not it would throw failed unit test
  });
  
  it("power function shoud have aspect injected", () => {
    function loggingAspect(snapshot: ISnapshot) {
      expect(snapshot.functionName).toEqual("power");
      expect(snapshot.className).toEqual("MyBussinessLogic");
      expect(snapshot.output).toEqual(11);
      console.log(`Calling the  function: ${ snapshot.functionName}`);
      console.log(`Arguments received: ${ snapshot.input }`);
    }
    
    AspectInjection.inject(MyBussinessLogic, loggingAspect);
    
    const logic = new MyBussinessLogic()
    logic.power(3,2);

    AspectInjection.clear(MyBussinessLogic);
    logic.add(1,1); // make sure aop clear, if not it would throw failed unit test
  });
});