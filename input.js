import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
    background-color: steelblue;
    padding: 5px;
  }
</style>

<input id="input" type="text" value="" on-change="onChange">
`;

class PollarisInput extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      value: {
        type: String,
        value: '---',
        observer: 'observeValue',
      },
    };
  }

  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  observeValue(oldValue, newValue) {
    this.$.querySelector('#input').value = newValue;
  }

  onChange(event) {
    this.fire('pollaris-updatename', {
      value: event.target.value,
    });
  }
}

customElements.define('pollaris-input', PollarisInput);
