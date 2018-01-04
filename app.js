import BaseElement from './base-element.js';

import './route.js';
import './nav.js';
import './store.js';

import './page1.js';
import './page2.js';
import './page3.js';
import './page4.js';


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

<h3 id="user-status"></h3>

<pollaris-nav></pollaris-nav>

<div id="content">
  <h2 id="page-title"></h2>

  <pollaris-page1 class="page" id="page-1"></pollaris-page1>

  <pollaris-page2 class="page" id="page-2"></pollaris-page2>

  <pollaris-page3 class="page" id="page-3"></pollaris-page3>

  <pollaris-page4 class="page" id="page-4"></pollaris-page4>

  <slot></slot>
</div>

<pollaris-nav></pollaris-nav>
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

      user: {
        type: Object,
        value: null,
        observer: 'observeUser',
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
        }, {
          id: 'page-4',
          name: 'Account',
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

    this.initAuth();

    this.onUpdateName = this.onUpdateName.bind(this);
    this.onUpdateItems = this.onUpdateItems.bind(this);
    this.onUpdatePage = this.onUpdatePage.bind(this);
    this.onUpdateRoute = this.onUpdateRoute.bind(this);
    this.onLoadStore = this.onLoadStore.bind(this);
    this.onUpdateList = this.onUpdateList.bind(this);
    this.userSignIn = this.userSignIn.bind(this);
    this.userSignOut = this.userSignOut.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updateitems', this.onUpdateItems);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    this.on(this, 'pollaris-updatelist', this.onUpdateList);
    this.on(this, 'pollaris-loadstore', this.onLoadStore);
    this.on(this, 'pollaris-usersignin', this.userSignIn);
    this.on(this, 'pollaris-usersignout', this.userSignOut);

    this.$('pollaris-route').update();
    this.loading = true;
  }

  initAuth() {
    if (firebase) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      });
    }
  }

  observeLoading(oldValue, value) {
    if (value) {
      this.$id['content'].classList.add('loading');
    } else {
      this.$id['content'].classList.remove('loading');
    }
  }

  observePage(oldValue, value) {
    if (oldValue) {
      this.$(`#${oldValue}`).classList.remove('active');
    }

    if (value) {
      const page = this.$(`#${value}`);

      page.classList.add('active');

      [...this.$$('pollaris-nav')]
        .map(el => el.set('active', value));

      this.$('pollaris-route').set('route', value);
      this.$id['page-title'].textContent
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
        case 'page-4':
          this.initPage4();
          break;
        default:
          break;
      }
    }
  }

  initPage1() {
    const page1 = this.$('pollaris-page1');

    page1.set('name', this.data.name);
  }

  initPage2() {
    const page2 = this.$('pollaris-page2');

    page2.set('items', this.data.items);
  }

  initPage3() {
    const page3 = this.$('pollaris-page3');

    page3.set('list', this.list);
  }

  initPage4() {
    const page4 = this.$('pollaris-page4');

    page4.set('user', this.user);
  }

  userSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider);
  }

  userSignOut() {
    firebase.auth().signOut().then(() => {
      this.user = null;
    });
  }

  observePages(oldValue, value) {
    [...this.$$('pollaris-nav')]
      .map(el => el.set('items', value));
  }

  observeUser(oldValue, value) {
    this.initPage4();

    const el = this.$id['user-status'];
    if (value) {
      el.textContent = `signed in as ${this.user.email}`;
    } else {
      el.textContent = 'signed out'
    }
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

    this.$('pollaris-store[name=data]').update(value);
  }

  observeList(oldValue, value) {
    if (this.page === 'page-3') {
      this.initPage3();
    }

    this.$('pollaris-store[name=list]').update(value);
  }

  onUpdateList(event) {
    this.list = {
      name: event.detail.name,
      items: event.detail.items,
    };
  }

  onUpdateName(event) {
    this.data = {
      name: event.detail.value,
      items: this.data.items.slice(),
    };
  }

  onUpdateItems(event) {
    this.data = {
      name: this.data.name,
      items: event.detail.items,
    };
  }

  onUpdatePage(event) {
    this.page = event.detail.pageId;
  }

  onUpdateRoute(event) {
    this.page = event.detail.route;
  }

  onLoadStore(event) {
    if (event.detail) {
      if (event.detail.name === 'data') {
        this.data = event.detail.store;
      } else if (event.detail.name === 'list') {
        this.list = event.detail.store;
      }
    }

    this.loading = false;
  }
}

customElements.define('pollaris-app', PollarisApp);
