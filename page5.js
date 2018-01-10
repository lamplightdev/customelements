import FullMixin from './full-mixin.js';
import PollarisRepeat from './repeat.js';

import './dash.js';

const template = `
<style>
  :host {
    display: block;
  }

  .output {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>

<template>
  <pollaris-dash></pollaris-dash>
</template>

<div class="output"></div>
`;

class PollarisPage5 extends PollarisRepeat(FullMixin(HTMLElement, template)) {
  static get props() {
    return {
      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      },
    };
  }

  observeItems(oldValue, value) {
    super.observeItems(oldValue, value);
  }

  getKey(value, index) {
    return JSON.stringify(value);
  }

  initItemInstance(value, instance, index) {
    const el = instance.querySelector('pollaris-dash')

    const content = document.createElement(value.element);

    switch (value.element) {
      case 'pollaris-input':
        content.value = value.value;
        break;
      default:
        content.textContent = value.value;
        break;
    }

    el.appendChild(content);

    return el;
  }

  updateItemInstance(value, el, index) {
    return el;
  }
}

customElements.define('pollaris-page5', PollarisPage5);
