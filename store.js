import BaseElement from './base-element.js';

class PollarisStore extends BaseElement(HTMLElement) {
  static get props() {
    return {
      store: {
        type: Object,
        value: {},
        observer: 'observeStore'
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    let store = localStorage.getItem(`pollaris-${this.getAttribute('name')}`);
    if (store !== null) {
      store = JSON.parse(store);

      this.store = store;

      setTimeout(() => {
        this.fire('pollaris-loadstore', {
          name: this.getAttribute('name'),
          store,
        });
      });
    } else {
      setTimeout(() => {
        this.fire('pollaris-loadstore');
      });
    }
  }

  observeStore(oldValue, value) {
    this.fire('pollaris-updatestore', {
      name: this.getAttribute('name'),
      store: this.store,
    });
  }

  update(store) {
    console.log(this.getAttribute('name'), store);
    localStorage.setItem(`pollaris-${this.getAttribute('name')}`, JSON.stringify(store));

    this.store = store;
  }
}

customElements.define('pollaris-store', PollarisStore);
