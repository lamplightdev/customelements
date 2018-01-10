

import FullMixin from './full-mixin.js';
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

class PollarisItems extends PollarisRepeat(FullMixin(HTMLElement, template)) {
  static get props() {
    return {
      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      },
    };
  }

  initItemInstance(value, instance, index) {
    const test = instance.querySelector('pollaris-test');

    test.content = value.value;

    return test;
  }

  updateItemInstance(value, el, index) {
    el.content = value.value;

    return el;
  }
}

customElements.define('pollaris-items', PollarisItems);
