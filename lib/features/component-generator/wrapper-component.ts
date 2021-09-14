import React, { Component } from 'react';

export const original_component_predefined = "__component__";
export class WrapperComponent {
  static wrap(component) {
    return (...args) => {
      this[original_component_predefined] = component;
      return this.snap.apply(this, args);
    };
  }
  static snap(...args){
    return this[original_component_predefined].apply(this, args);
  }
}

export default Component
