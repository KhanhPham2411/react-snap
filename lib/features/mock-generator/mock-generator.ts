import { AnyAction } from "redux";

export class MockGenerator  {
  static getClosure(funcString, doEval){
    let tempString = funcString;
    tempString = tempString.replace("Promise)","");
    tempString = tempString.replace(/case.*?:/g,"");
    tempString = tempString.replace("(1)","");
    tempString = tempString.replace(/".+?"/g,"");
    const keys = tempString.split(/[\s,=+;:\{\}\.\(\)]+/);
    const closure = {};
    keys.forEach(key => {
      try{
        if(key === "this"){return;}
        if(parseInt(key)){return;}  

        const value = doEval(key);

        if(value){
          closure[key] = value;
        }
      }catch{}
    });

    return closure;
  }
  static mockFunction(funcString, doEval){
    const closure = MockGenerator.getClosure(funcString, doEval);
    const closureAppend = Object.getOwnPropertyNames(closure).map((key) => {
      return `var ${key} = self.eval('${key}');`;
    }).join("");
    const functionName = (/function (.*?)\(/g.exec(funcString) as any[])[1];
    const newFuncString = "var self = this;" + closureAppend 
    + funcString 
    + `; return ${functionName}.apply(self, arguments);`

    return new Function(newFuncString);
  }
}

