import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
    border: 1px solid red;
    padding: 5px;
  }

  h1 {
    color: blue;
  }
</style>

<h1>Hi <span id="name" on-click="test"></span>!</h1>
<slot name="me"></slot>
`;

class PollarisCounter extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      name: {
        type: String,
        value: 'No name',
        observer: 'observeName',
      },

      a: {
        type: String,
        value: 'This is A',
        observer: 'observeA',
      },

      b: {
        type: Number,
        value: -1,
        reflectToAttribute: true,
      },
    };
  }

  constructor() {
    super();

    this.test = this.test.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  test() {
    console.log('woo', this);
  }

  observeName(oldValue, newValue) {
    this.$.querySelector('#name').textContent = newValue;
  }

  observeA(oldValue, newValue) {
    console.log('A', oldValue, newValue);
  }
}

customElements.define('pollaris-counter', PollarisCounter);
