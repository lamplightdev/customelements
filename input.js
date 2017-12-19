import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
    background-color: steelblue;
    padding: 5px;
  }
</style>

<input id="input" type="text" value="">
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
  
  connectedCallback() {
    super.connectedCallback();
    
    this.on(this.$.querySelector('#input'), 'change', this.onChange);
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