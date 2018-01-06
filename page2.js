import FullMixin from './full-mixin.js';
import './items.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-items></pollaris-items>

<form id="item" on-submit="submitItemForm">
  <input type="text" value="">
</form>
`;

class PollarisPage2 extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      items: {
        type: Array,
        value: ['1', '2', '3'],
        observer: 'observeItems',
      },
    };
  }

  observeItems(oldValue, value) {
    this.$('pollaris-items').items = value;
  }

  submitItemForm(event) {
    event.preventDefault();

    this.fire('pollaris-updateitems', {
      items: event.target.querySelector('input').value.toUpperCase().split(''),
    });
  }
}

customElements.define('pollaris-page2', PollarisPage2);
