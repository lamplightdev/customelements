

import BaseElement from './base-element.js';
import PollarisRepeat from './repeat.js';

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

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

  }

  initItemInstance(item, instance) {
    const test = instance.querySelector('pollaris-test');

    // cannot use .set() here as the custom element won't have been constructed yet
    // instead we set the property manually which will be picked up on construction
    test.content = item;
  }

  updateItemInstance(item, index) {
    this.$.querySelector(`.output pollaris-test:nth-child(${index + 1})`).set('content', item);
  }
}

customElements.define('pollaris-items', PollarisItems);
