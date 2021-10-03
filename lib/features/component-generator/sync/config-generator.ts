import { TestingGenerator } from "../../class-generator/testing-generator";

const fse = require('fs-extra'); 
const fspath = require("path");

export class ConfigGenerator extends TestingGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "config.template"), "utf-8");

  static generate(dirname){
    const configPath = dirname + this.getPath();
    if(fse.pathExistsSync(configPath)) return configPath;

    const resolvedTemplate = this.resolveTemplate(this.templateString);
    fse.outputFileSync(configPath, resolvedTemplate);

    return configPath;
  }

  static resolveTemplate(templateString){
    return this.fillTemplate(templateString, {});
  }  

  static getPath(): string{
    return `/config.ts`;
  }
}

export default ConfigGenerator
