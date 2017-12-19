import './counter.js';
import './input.js';

import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-counter id="counter"></pollaris-counter>

<pollaris-input id="input1"></pollaris-input>
<pollaris-input id="input2"></pollaris-input>

<slot></slot>
`;

class PollarisApp extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      data: {
        type: Object,
        value: {},
        observer: 'observeData',
      }
    }  
  }
  
  constructor() {
    super();
    
    this.onUpdateName = this.onUpdateName.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    this.on(this, 'pollaris-updatename', this.onUpdateName)
  }
  
  observeData(oldValue, value) {
    this.$.querySelector('#counter').set('name', value.name);
    this.$.querySelector('#input1').set('value', value.name);
    this.$.querySelector('#input2').set('value', value.name);
  }
  
  onUpdateName(event) {
    this.set('data', {
      name: event.detail.value,
    });
  }
}

customElements.define('pollaris-app', PollarisApp);