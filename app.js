import './counter.js';
import './input.js';
import './route.js';
import './nav.js';
import './items.js';
import './store.js';


import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }

  #content.loading {
    display: none;
  }

  .page {
    display: none;
  }

  .page.active {
    display: block;
  }
</style>

<pollaris-store name="data"></pollaris-store>
<pollaris-route defaultroute="page-1"></pollaris-route>
<pollaris-nav></pollaris-nav>

<div id="content">
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

    <pollaris-items></pollaris-items>

    <form id="item">
      <input type="text" value="">
    </form>
  </div>

  <slot></slot>
</div>
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
          items: ['1', '2', '3'],
        },
        observer: 'observeData',
      },

      loading: {
        type: Boolean,
        value: false,
        observer: 'observeLoading',
      }
    }
  }

  constructor() {
    super();

    this.onUpdateName = this.onUpdateName.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onUpdateRoute = this.onUpdateRoute.bind(this);
    this.onLoadStore = this.onLoadStore.bind(this);
    this.submitItemForm = this.submitItemForm.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    this.on(this, 'pollaris-loadstore', this.onLoadStore);

    this.on(this.$.querySelector('#item'), 'submit', this.submitItemForm);

    this.$.querySelector('pollaris-route').update();
    this.set('loading', true);
  }

  observeLoading(oldValue, value) {
    if (value) {
      this.$.querySelector('#content').classList.add('loading');
    } else {
      this.$.querySelector('#content').classList.remove('loading');
    }
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
    this.$.querySelector('pollaris-nav').set('items', value);
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

    if (value.items) {
      const itemsEl = this.$.querySelector('pollaris-items');

      if (itemsEl) {
        itemsEl.set('items', value.items);
      }
    }

    this.$.querySelector('pollaris-store').update(value);
  }

  onUpdateName(event) {
    this.set('data', {
      name: event.detail.value,
      items: this.data.items.slice(),
    });
  }

  onUpdatePage(event) {
    this.set('page', event.detail.pageId);
  }

  onUpdateRoute(event) {
    this.set('page', event.detail.route);
  }

  submitItemForm(event) {
    event.preventDefault();

    this.set('data', {
      name: this.data.name,
      items: event.target.querySelector('input').value.toUpperCase().split(''),
    });
  }

  onLoadStore(event) {
    if (event.detail && event.detail.name === 'data') {
      this.set('data', event.detail.store);
    }

    this.set('loading', false);
  }
}

customElements.define('pollaris-app', PollarisApp);
