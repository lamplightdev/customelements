import './counter.js';
import './input.js';

import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }

  .page {
    display: none;
  }

  .page.active {
    display: block;
  }
</style>

<h2 id="page-title"></h2>

<a href="" class="to-page" page="page-1">Page 1</a> | <a href="" class="to-page" page="page-2">Page 2</a>

<div class="page" id="page-1">
  <template>
    <pollaris-counter id="counter"></pollaris-counter>
    <pollaris-input id="input1"></pollaris-input>
    <pollaris-input id="input2"></pollaris-input>
  </template>
</div>

<div class="page" id="page-2">
  <h1>Page 2</h1>
</div>

<slot></slot>
`;

class PollarisApp extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      page: {
        type: String,
        value: '',
        observer: 'observePage',
      },
      
      data: {
        type: Object,
        value: {
          name: 'Default',
        },
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
    
    this.on(this, 'pollaris-updatename', this.onUpdateName);
    
    if (window.location.hash) {
      this.set('page', window.location.hash.substring(1));
    } else {
      this.set('page', 'page-1');
    }
    
    [...this.$.querySelectorAll('.to-page')].forEach((el) => {
      this.on(el, 'click', (event) => {
        event.preventDefault();
        
        const page = event.target.getAttribute('page');
        this.set('page', page);
        history.pushState({}, page, `#${page}`);
      })
    });
  }
  
  observePage(oldValue, value) {
    if (oldValue) {
      this.$.querySelector(`#${oldValue}`).classList.remove('active');
    }
    
    if (value) {
      const page = this.$.querySelector(`#${value}`);

      [...page.querySelectorAll('template')].forEach((template) => {
        const instance = template.content.cloneNode(true);
        template.parentNode.replaceChild(instance, template);

        if (typeof this.data !== 'undefined') {
          this.observeData(null, this.data);
        }
      });

      page.classList.add('active');
      
      this.$.querySelector('#page-title').textContent = value;
    }
  }
  
  observeData(oldValue, value) {
    const counter = this.$.querySelector('#counter');
    if (counter) {
      counter.set('name', value.name);
    }
    
    const input1 = this.$.querySelector('#input1');
    if (input1) {
      input1.set('value', value.name);
    }
    
    const input2 = this.$.querySelector('#input2');
    if (input2) {
      input2.set('value', value.name);
    }
  }
  
  onUpdateName(event) {
    this.set('data', {
      name: event.detail.value,
    });
  }
}

customElements.define('pollaris-app', PollarisApp);