import BaseElement from './base-element.js';

import './route.js';
import './nav.js';
import './store.js';

import './page1.js';
import './page2.js';
import './page3.js';


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

  <pollaris-page1 class="page" id="page-1"></pollaris-page1>

  <pollaris-page2 class="page" id="page-2"></pollaris-page2>

  <pollaris-page3 class="page" id="page-3"></pollaris-page3>

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
    this.onUpdateItems = this.onUpdateItems.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onUpdateRoute = this.onUpdateRoute.bind(this);
    this.onLoadStore = this.onLoadStore.bind(this);
    this.onUpdateList = this.onUpdateList.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updateitems', this.onUpdateItems);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    this.on(this, 'pollaris-updatelist', this.onUpdateList);
    this.on(this, 'pollaris-loadstore', this.onLoadStore);

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

      page.classList.add('active');

      this.$.querySelector('pollaris-nav').set('active', value);
      this.$.querySelector('pollaris-route').set('route', value);
      this.$.querySelector('#page-title').textContent
        = this.pages.find(page => page.id === value).name;

      switch (value) {
        case 'page-1':
          this.initPage1();
          break;
        case 'page-2':
          this.initPage2();
          break;
        case 'page-3':
          this.initPage3();
          break;
        default:
          break;
      }
    }
  }

  initPage1() {
    const page1 = this.$.querySelector('pollaris-page1');

    page1.set('name', this.data.name);
  }

  initPage2() {
    const page2 = this.$.querySelector('pollaris-page2');

    page2.set('items', this.data.items);
  }

  initPage3() {
    const page3 = this.$.querySelector('pollaris-page3');

    page3.set('list', this.list);
  }

  observePages(oldValue, value) {
    this.$.querySelector('pollaris-nav').set('items', value);
  }

  observeData(oldValue, value) {
    switch (this.page) {
      case 'page-1':
        this.initPage1();
        break;
      case 'page-2':
        this.initPage2();
        break;
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

  onUpdateItems(event) {
    this.set('data', {
      name: this.data.name,
      items: event.detail.items,
    });
  }

  onUpdatePage(event) {
    this.set('page', event.detail.pageId);
  }

  onUpdateRoute(event) {
    this.set('page', event.detail.route);
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
