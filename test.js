import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<span></span>
`;

class PollarisTest extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      content: {
        type: String,
        value: '',
        observer: 'observeContent',
      },
    };
  }

  observeContent(oldValue, value) {
    this.$.querySelector('span').textContent = value;
  }
}

customElements.define('pollaris-test', PollarisTest);
