import React, { Component } from 'react'
import { ConfigGenerator } from '../sync/config-generator';

const fse = require('fs-extra'); 
const fspath = require("path");

export class WrapperComponentGenerator extends ConfigGenerator {
  static templateString = fse.readFileSync(fspath.resolve(__dirname, "wrapper-component.ts"), "utf-8");

  static getPath(): string{
    return `/wrapper-component.ts`;
  }
}

export default WrapperComponentGenerator
