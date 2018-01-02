

import BaseElement from './base-element.js';
import PollarisRepeat from './repeat.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<template>
  <pollaris-listitem></pollaris-listitem>
</template>

<div class="output"></div>
`;

class PollarisListItems extends PollarisRepeat(BaseElement(HTMLElement, template)) {
  static get props() {
    return {
      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      },
    };
  }

  initItemInstance(item, instance, index) {
    const test = instance.querySelector('pollaris-listitem');

    // cannot use .set() here as the custom element won't have been constructed yet
    // instead we set the property manually which will be picked up on construction
    test.due = item.due;
    test.content = item.content;
  }

  updateItemInstance(item, index) {
    const el = this.$.querySelector(`.output pollaris-listitem:nth-child(${index + 1})`)
    el.set('ident', item.due);
    el.set('content', item.content);
  }
}

customElements.define('pollaris-listitems', PollarisListItems);
