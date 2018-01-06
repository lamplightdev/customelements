

import FullMixin from './full-mixin.js';
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

class PollarisListItems extends PollarisRepeat(FullMixin(HTMLElement, template)) {
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

    test.due = item.due;
    test.content = item.content;
  }

  updateItemInstance(item, index) {
    const el = this.$$(`.output pollaris-listitem`)[index]
    el.due = item.due;
    el.content = item.content;
  }

  remove(item, index, event) {
    this.fire(`pollaris-removefromlist`, {
      index,
    });
  }
}

customElements.define('pollaris-listitems', PollarisListItems);
