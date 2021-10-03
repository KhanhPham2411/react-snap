export const original_descriptor_predefined = "__descriptor__";
export const original_component_predefined = "__component__";
export const original_function_predefined = "__function__";

export const getMethods = (target) =>
  Object.getOwnPropertyNames(target).filter(
    (item) => typeof target[item] === "function" 
    && !item.startsWith(original_descriptor_predefined)
    && item.toLowerCase().indexOf("mock") == -1
    && item !== "constructor"
    && item !== "doAsync"
    && item !== "getEval"
  );

export const mergeMethods = (source, target) => {
  getMethods(source).forEach((method) => {
    target[method] = source[method];    
  });
}

export const getProperties = (target) =>
  Object.getOwnPropertyNames(target).filter(
    (item) => typeof target[item] !== "function" 
    && !item.startsWith(original_descriptor_predefined)
    && item.toLowerCase().indexOf("mock") == -1
    && item !== "constructor"
  );

export const getFuncList = (namespaces) => {
  let funcList: string[] = [];
  const classes = Object.getOwnPropertyNames(namespaces);
  for(const className of classes){
    const classTarget = namespaces[className];
    if(classTarget){
      let methods = getMethods(classTarget)

      const prototype = classTarget.prototype;
      if(prototype){
        prototype.name = classTarget.name;
        methods = methods.concat(getMethods(prototype));
      }
      
      for(const method of methods){
        funcList.push(`${className}.${method}`);
      }
    }
  }

  return funcList;
}

export const getFunc = (namespaces, className, functionName) => {
  return namespaces[className][functionName] ?? namespaces[className].prototype[functionName];
}

export const lowerFirstLetter = (text: string) => {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export const generateUniqueId = () => {
  return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
}