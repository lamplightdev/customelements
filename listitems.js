

import BaseElement from './base-element.js';
import PollarisRepeat from './repeat.js';

import './listitem.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<template>
  <div>
    <pollaris-listitem></pollaris-listitem>
    <button on-click="remove">x</button>
  </div>
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

  constructor() {
    super();

    this.remove = this.remove.bind(this);
  }

  initItemInstance(item, instance, index) {
    const test = instance.querySelector('pollaris-listitem');

    // cannot use .set() here as the custom element won't have been constructed yet
    // instead we set the property manually which will be picked up on construction
    test.due = item.due;
    test.content = item.content;
  }

  updateItemInstance(item, index) {
    const el = this.$.querySelectorAll(`.output pollaris-listitem`)[index]
    el.set('due', item.due);
    el.set('content', item.content);
  }

  remove(item, index, event) {
    this.fire(`pollaris-removefromlist`, {
      index,
    });
  }
}

customElements.define('pollaris-listitems', PollarisListItems);
