import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<h2></h2>

<button id="update" on-click="update">Update</button>
<button id="clear" on-click="clear">Clear</button>

<pollaris-listitems></pollaris-listitems>
`;

class PollarisList extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      name: {
        type: String,
        value: 'This List',
        observer: 'observeName',
      },

      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      }
    };
  }

  constructor() {
    super();

    this.update = this.update.bind(this);
    this.clear = this.clear.bind(this);
  }

  observeName(oldValue, value) {
    this.$.querySelector('h2').textContent = value;
  }

  observeItems(oldValue, value) {
    this.$.querySelector('pollaris-listitems').set('items', value);
  }

  update(event) {
    const now = Date.now();
    this.fire('pollaris-updatelist', {
      name: now,
      items: this.items.concat({
        content: now,
        due: now + 1000,
      }),
    });
  }

  clear(event) {
    console.log(event.target);

    const now = Date.now();
    this.fire('pollaris-updatelist', {
      name: now,
      items: [],
    });
  }
}

customElements.define('pollaris-list', PollarisList);
