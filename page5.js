import FullMixin from './full-mixin.js';
import PollarisRepeat from './repeat.js';

import './dash.js';
import './input.js';

const template = `
<style>
  :host {
    display: block;
  }

  .output {
    position: relative;
  }

  pollaris-dash {
    position: absolute;
    background-color: white;
  }
</style>

<template>
  <pollaris-dash></pollaris-dash>
</template>

<button on-click="rotate">Rotate</button>
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

  connectedCallback() {
    super.connectedCallback();
  }

  observeItems(oldValue, value) {
    super.observeItems(oldValue, value);
  }

  getKey(value, index) {
    return JSON.stringify(Object.assign({}, value, {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    }));
  }

  initItemInstance(value, instance, index) {
    const el = instance.querySelector('pollaris-dash');
    el.width = value.width;
    el.height = value.height;
    el.x = value.x;
    el.y = value.y;

    this.on(el, 'dashresizeto', (event) => {
      event.stopPropagation();

      const key = this.getKey(value);
      const foundIndex = this.items
        .findIndex(item => this.getKey(item) === key);

      this.fire('appdashresizeto', Object.assign({}, event.detail, {
        index: foundIndex,
      }));
    });

    this.on(el, 'dashmoveto', (event) => {
      event.stopPropagation();

      const key = this.getKey(value);
      const foundIndex = this.items
        .findIndex(item => this.getKey(item) === key);

      this.fire('appdashmoveto', Object.assign({}, event.detail, {
        index: foundIndex,
      }));
    });

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
    el.width = value.width;
    el.height = value.height;
    el.x = value.x;
    el.y = value.y;

    return el;
  }

  rotate() {
    this.fire('pollaris-dash');
  }
}

customElements.define('pollaris-page5', PollarisPage5);
