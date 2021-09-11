import { MockGenerator } from '../../../features/mock-generator/mock-generator';
function splitMulti(str, separators){
  var tempChar = 't3mp'; //prevent short text separator in split down
  
  //split by regex e.g. \b(or|and)\b
  var re = new RegExp('\\b(' + separators.join('|') + ')\\b' , "g");
  str = str.replace(re, tempChar).split(tempChar);
  
  // trim & remove empty
  return str.map(el => el.trim()).filter(el => el.length > 0);
}

it("test context", async () => {
  const plus = 2;
  class MyBussinessLogic {
    static async add(a, b) {
      const result = a + b + plus;
      return result;
    }
    getEval(){
      return function(name) { return eval(name) };
    }
    async doMock(funcString, self, args) {
      self.eval = function(name) { return eval(name) }
      return MockGenerator.mockFunction(funcString, self.eval).apply(self, args);
    }
  }

  const funcString = MyBussinessLogic.add.toString();
  const self = this;
  const args = [1, 2]
  self.eval = MyBussinessLogic.prototype.getEval();
  const result = await MockGenerator.mockFunction(funcString, self.eval).apply(self, args);
  console.log(result);

  // const result = MyBussinessLogic.prototype.doMock(funcString, this, [1, 2]);
  // console.log(result)
})