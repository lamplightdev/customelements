import './counter.js';
import './input.js';
import './route.js';
import './nav.js';
import './items.js';
import './store.js';
import './test.js';
import './list.js';
import './listitems.js';
import './listitem.js';


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
<pollaris-store name="list"></pollaris-store>

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
    <pollaris-items></pollaris-items>

    <form id="item" on-submit="submitItemForm">
      <input type="text" value="">
    </form>
  </div>

  <div class="page" id="page-3">
    <pollaris-list></pollaris-list>
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
        reflectToAttribute: true,
      },

      pages: {
        type: Array,
        value: [{
          id: 'page-1',
          name: 'Page 1',
        }, {
          id: 'page-2',
          name: 'Page 2',
        }, {
          id: 'page-3',
          name: 'Page 3 (List)',
        }],
        observer: 'observePages',
      },

      list: {
        type: Object,
        value: {
          name: 'My List',
          items: [],
        },
        observer: 'observeList',
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
        reflectToAttribute: true,
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
    this.onUpdateList = this.onUpdateList.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    this.on(this, 'pollaris-loadstore', this.onLoadStore);
    this.on(this, 'pollaris-updatelist', this.onUpdateList);

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
      this.$.querySelector('#page-title').textContent = this.pages.find(page => page.id === value).name;

      switch (value) {
        case 'page-3':
          this.initPage3();
          break;
        default:
          break;
      }
    }
  }

  initPage3() {
    const list = this.$.querySelector('#page-3 pollaris-list');

    list.set('name', this.list.name);
    list.set('items', this.list.items);
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

    this.$.querySelector('pollaris-store[name=data]').update(value);
  }

  observeList(oldValue, value) {
    if (this.page === 'page-3') {
      this.initPage3();
    }

    this.$.querySelector('pollaris-store[name=list]').update(value);
  }

  onUpdateList(event) {
    this.set('list', {
      name: event.detail.name,
      items: event.detail.items,
    });
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
    if (event.detail) {
      if (event.detail.name === 'data') {
        this.set('data', event.detail.store);
      } else if (event.detail.name === 'list') {
        this.set('list', event.detail.store);
      }
    }

    this.set('loading', false);
  }
}

customElements.define('pollaris-app', PollarisApp);
