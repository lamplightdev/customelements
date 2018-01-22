import FullMixin from './full-mixin.js';
import PollarisRepeat from './repeat.js';

const template = `
<style>
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
  }


  div {
    position: relative;
    padding: 1rem;
    border: 1px solid steelblue;
  }
</style>

<template>
  <div></div>
</template>

<button on-click="shuffle">Shuffle</button>
<div class="output"></div>
`;

class PollarisPage6 extends PollarisRepeat(FullMixin(HTMLElement, template)) {
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
    return value.id;
  }

  initItemInstance(value, instance, index) {
    const el = instance.querySelector('div');

    el.innerText = value.value;

    return el;
  }

  updateItemInstance(value, el, index) {
    return el;
  }

  shuffle() {
    const els = [...this.$$('.output >div')];

    els.forEach((el) => {
      el.style.transform =
    });

    setTimeout(() => {
      this.items = [
        this.items[2],
        this.items[0],
        this.items[1],
      ];
    }, 5000);
  }
}

customElements.define('pollaris-page6', PollarisPage6);
