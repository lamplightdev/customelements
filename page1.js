import BaseElement from './base-element.js';
import './counter.js';
import './input.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-counter id="counter"></pollaris-counter>
<pollaris-input id="input1"></pollaris-input>
<pollaris-input id="input2"></pollaris-input>
`;

class PollarisPage1 extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      name: {
        type: String,
        value: 'Default name',
        observer: 'observeName',
      },
    };
  }

  observeName(oldValue, value) {
    const counter = this.$.querySelector('#counter');
    if (counter) {
      counter.set('name', value);
    }

    const input1 = this.$.querySelector('#input1');
    if (input1) {
      input1.set('value', value);
    }

    const input2 = this.$.querySelector('#input2');
    if (input2) {
      input2.set('value', value);
    }
  }
}

customElements.define('pollaris-page1', PollarisPage1);
