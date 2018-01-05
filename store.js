import BaseElement from './base-element.js';

class PollarisStore extends BaseElement(HTMLElement) {
  static get props() {
    return {
      store: {
        type: Object,
        value: null,
        observer: 'observeStore',
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    let store = localStorage.getItem(`pollaris-${this.getAttribute('name')}`);
    if (store !== null) {
      store = JSON.parse(store);

      this.store = store;
    }
  }

  observeStore(oldValue, value) {
  }

  retrieve() {
    return Promise.resolve().then(() => this.store);
  }

  update(store) {
    return Promise.resolve().then(() => {
      localStorage.setItem(`pollaris-${this.getAttribute('name')}`, JSON.stringify(store));

      this.store = store;
    });
  }
}

customElements.define('pollaris-store', PollarisStore);
