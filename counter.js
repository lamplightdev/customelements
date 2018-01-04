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

<h1>Hi <span id="name"></span>!</h1>
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
    };
  }

  observeName(oldValue, newValue) {
    this.$id['name'].textContent = newValue;
  }
}

customElements.define('pollaris-counter', PollarisCounter);
