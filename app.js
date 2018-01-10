import FullMixin from './full-mixin.js';

import './route.js';
import './nav.js';
import './store.js';

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

<pollaris-store id="store-data" name="data"></pollaris-store>
<pollaris-store id="store-list" name="list"></pollaris-store>
<pollaris-store id="store-dashes" name="dash"></pollaris-store>

<pollaris-route defaultroute="page-1"></pollaris-route>

<h3 id="user-status"></h3>

<pollaris-nav></pollaris-nav>

<div id="content">
  <h2 id="page-title"></h2>

  <pollaris-page1 class="page" id="page-1"></pollaris-page1>
  <pollaris-page2 class="page" id="page-2"></pollaris-page2>
  <pollaris-page3 class="page" id="page-3"></pollaris-page3>
  <pollaris-page4 class="page" id="page-4"></pollaris-page4>
  <pollaris-page5 class="page" id="page-5"></pollaris-page5>

  <slot></slot>
</div>

<pollaris-nav></pollaris-nav>
`;

class PollarisApp extends FullMixin(HTMLElement, template) {
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

      db: {
        type: Object,
        value: null,
        observer: 'observeDb',
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
        }, {
          id: 'page-5',
          name: 'EventDash',
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
          items: [{
            value: '1',
          }, {
            value: '2',
          }, {
            value: '3',
          }],
        },
        observer: 'observeData',
      },

      dashes: {
        type: Array,
        value: [{
          element: 'em',
          value: 'A',
          width: 200,
          height: 200,
        }, {
          element: 'h1',
          value: 'B',
          width: 200,
          height: 200,
        }, {
          element: 'pollaris-input',
          value: 'C',
          width: 200,
          height: 200,
        }],
        observeDashes: 'observeDashes',
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
    this.initDb();
  }

  async connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-updatename', this.onUpdateName);
    this.on(this, 'pollaris-updateitems', this.onUpdateItems);
    this.on(this, 'pollaris-updatepage', this.onUpdatePage);
    this.on(this, 'pollaris-updateroute', this.onUpdateRoute);
    this.on(this, 'pollaris-updatelist', this.onUpdateList);
    this.on(this, 'pollaris-usersignin', this.onUserSignIn);
    this.on(this, 'pollaris-usersignout', this.onUserSignOut);
    this.on(this, 'pollaris-storeupdate', this.onStoreUpdate);
    this.on(this, 'pollaris-dash', this.onDash);
    this.on(this, 'appdashresizeto', this.onDashResizeTo);

    this.$('pollaris-route').update();

    this.loading = true;

    this.$id['store-data'].listen();
    this.$id['store-list'].listen();
    this.$id['store-dashes'].listen();

    let data = this.$id['store-data'].retrieve();
    let list = this.$id['store-list'].retrieve();
    let dashes = this.$id['store-dashes'].retrieve();

    data = await data;
    list = await list;
    dashes = await dashes;

    if (data !== null) this.data = data;
    if (list !== null) this.list = list;
    if (dashes !== null) this.dashes = dashes;

    this.loading = false;
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

  initDb() {
    if (firebase) {
      this.db = firebase.firestore();
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
        .map(el => el.active = value);

      this.$('pollaris-route').route = value;
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
        case 'page-5':
          this.initPage5();
          break;
        default:
          break;
      }
    }
  }

  initPage1() {
    if (this.page !== 'page-1') return;

    this.loadScript('./page1.js')
      .then(() => {
        const page1 = this.$('pollaris-page1');

        page1.name = this.data.name;
      });
  }

  initPage2() {
    if (this.page !== 'page-2') return;

    this.loadScript('./page2.js')
      .then(() => {
        const page2 = this.$('pollaris-page2');

        page2.items = this.data.items;
      });
  }

  initPage3() {
    if (this.page !== 'page-3') return;

    this.loadScript('./page3.js')
      .then(() => {
        const page3 = this.$('pollaris-page3');

        page3.list = this.list;
      });
  }

  initPage4() {
    if (this.page !== 'page-4') return;

    this.loadScript('./page4.js')
      .then(() => {
        const page4 = this.$('pollaris-page4');

        page4.user = this.user;
      });
  }

  initPage5() {
    if (this.page !== 'page-5') return;

    this.loadScript('./page5.js')
      .then(() => {
        const page5 = this.$('pollaris-page5');

        page5.items = this.dashes;
      });
  }

  observePages(oldValue, value) {
    [...this.$$('pollaris-nav')]
      .map(el => el.items = value);
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

  observeDb(oldValue, value) {
    this.$$('pollaris-store').forEach(store => store.db = value);
  }

  observeData(oldValue, value, fromInitialisation = false) {
    switch (this.page) {
      case 'page-1':
        this.initPage1();
        break;
      case 'page-2':
        this.initPage2();
        break;
    }

    if (!fromInitialisation) {
      this.$('pollaris-store[name=data]').update(value);
    }
  }

  observeList(oldValue, value, fromInitialisation = false) {
    if (this.page === 'page-3') {
      this.initPage3();
    }

    if (!fromInitialisation) {
      this.$('pollaris-store[name=list]').update(value);
    }
  }

  observeDashes(oldValue, value, fromInitialisation = false) {
    if (this.page === 'page-5') {
      this.initPage5();
    }

    if (!fromInitialisation) {
      this.$('pollaris-store[name=dashes]').update(value);
    }
  }

  onUserSignIn(event) {
    let provider;

    switch (event.detail.provider) {
      case 'google': {}
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      default:
        break;
    }

    if (provider) {
      firebase.auth().signInWithRedirect(provider);
    }

  }

  onUserSignOut() {
    firebase.auth().signOut().then(() => {
      this.user = null;
    });
  }

  onStoreUpdate(event) {
    if (event.detail.data) {
      const { name, data } = event.detail;

      switch (name) {
        case 'list':
          this.list = data;
          break;
        case 'data':
          this.data = data;
          break;
        default:
          break;
      };
    }
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

  onDash(event) {
    this.dashes = [this.dashes[2], this.dashes[0], this.dashes[1]];
    this.initPage5();
  }

  onDashResizeTo(event) {
    console.log(event.detail);
    const { index, width, height } = event.detail;

    this.dashes = this.dashes.slice(0, index)
      .concat([Object.assign(this.dashes[index], {
        width,
        height,
      })], this.dashes.slice(index + 1));

    this.initPage5();
  }
}


customElements.define('pollaris-app', PollarisApp);
