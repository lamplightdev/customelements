import BaseElement from './base-element.js';
import PollarisRepeat from './repeat.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<template>
  <span></span>
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
    const span = instance.querySelector('span');

    span.textContent = item;
  }
}

customElements.define('pollaris-items', PollarisItems);
