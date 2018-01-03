

import BaseElement from './base-element.js';
import PollarisRepeat from './repeat.js';

import './test.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<template>
  <pollaris-test></pollaris-test>
</template>

<div class="output"></div>
`;

class PollarisItems extends PollarisRepeat(BaseElement(HTMLElement, template)) {
  static get props() {
    return {
      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      },
    };
  }

  initItemInstance(item, instance) {
    const test = instance.querySelector('pollaris-test');

    test.content = item;
  }

  updateItemInstance(item, index) {
    this.$.querySelector(`.output pollaris-test:nth-child(${index + 1})`).set('content', item);
  }
}

customElements.define('pollaris-items', PollarisItems);
