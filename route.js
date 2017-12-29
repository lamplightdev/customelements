import BaseElement from './base-element.js';

class PollarisRoute extends BaseElement(HTMLElement) {
  static get props() {
    return {
      route: {
        type: String,
        value: '',
        observer: 'observeRoute',
      },

      defaultroute: {
        type: String,
        value: '',
      },
    };
  }

  update() {
    if (window.location.hash) {
      this.set('route', window.location.hash.substring(1));
    } else if (this.defaultroute) {
      this.set('route', this.defaultroute);
    }
  }

  observeRoute(oldValue, value) {
    if (value) {
      history.pushState({}, value, `#${value}`);

      this.fire('pollaris-updateroute', {
        route: value,
      });
    }
  }
}

customElements.define('pollaris-route', PollarisRoute);
