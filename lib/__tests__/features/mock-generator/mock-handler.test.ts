import { AspectInjection, ISnapshot } from "../../..";
import AsyncLock from "async-lock";
import { snapshotMap } from "../../../features/mock-generator/mock-handler";

const lock = new AsyncLock();

describe("aspect injection should work :))", () => {
  class MyBussinessLogic {
    static plus = 2;
    static add(a, b) {
      this.plus = 2;
      const result = a + b + this.plus;
      this.plus = 1;
      return result;
    }

    // getEval(){
    //   return function(name) { return eval(name) };
    // }

    static async addAsync(a, b) {
      // const test = this.add(a, b);
      const test3 = this.add(a, b);
      const test2 = await this.power(2, 1);
      expect(test2).toEqual(4);
      return this.add(a, b);
    }
    static async power(a, b) {
      this.plus = 2;
      const result = a ** b + this.plus;
      this.plus = 1;
      return result;
    }
  }
  it("add function shoud have aspect injected", async () => {
    function loggingAspect(snapshot: ISnapshot) {
      console.log(`Calling the  function: ${snapshot.functionName}`);

      expect(snapshot.targetName).toEqual("MyBussinessLogic");
      expect(snapshot.output).toEqual(4);
      expect(snapshot.classObjectAfter.plus).toEqual(1);
      expect(snapshot.isPrototype).toEqual(false);
      if (snapshot.functionName === "addAsync") {
        expect(snapshot.mocks.length).toEqual(2);
      }
    }

    AspectInjection.inject(MyBussinessLogic, loggingAspect);

    const logic = new MyBussinessLogic();
    const resultAsync = await lock.acquire("test", () => MyBussinessLogic.addAsync(1, 1));
    expect(resultAsync).toEqual(4);

    const listSnapId = Object.getOwnPropertyNames(snapshotMap);
    expect(listSnapId.length).toEqual(0);

    const result = MyBussinessLogic.add(1, 1);
    expect(result).toEqual(4);
    AspectInjection.clear(MyBussinessLogic);
    MyBussinessLogic.power(3, 2); // make sure aop clear, if not it would throw failed unit test
  });
});
