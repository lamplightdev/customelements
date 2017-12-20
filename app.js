import './counter.js';
import './input.js';
import './route.js';
import './nav.js';

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

<pollaris-route defaultroute="page-1"></pollaris-route>
<pollaris-nav></pollaris-nav>

<h2 id="page-title"></h2>

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
      
      pages: {
        type: Array,
        value: [{
          id: 'page-1',
          name: 'Page 1',
        }, {
          id: 'page-2',
          name: 'Page 2',
        }],
        observer: 'observePages',
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
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onUpdateRoute = this.onUpdateRoute.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    
    this.$.querySelector('pollaris-route').update();
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
      
      this.$.querySelector('pollaris-nav').set('active', value);
      this.$.querySelector('pollaris-route').set('route', value);
      this.$.querySelector('#page-title').textContent = value;
    }
  }
  
  observePages(oldValue, value) {
    this.$.querySelector('pollaris-nav').set('pages', value);
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
  
  onUpdatePage(event) {
    this.set('page', event.detail.pageId);
  }
  
  onUpdateRoute(event) {
    this.set('page', event.detail.route);
  }
}

customElements.define('pollaris-app', PollarisApp);