import BaseElement from './base-element.js';
import './listitems.js';

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
      },

      eventname: {
        type: String,
        value: 'updatelist',
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'pollaris-removefromlist', this.removeFromList);
  }

  observeName(oldValue, value) {
    this.$('h2').textContent = value;
  }

  observeItems(oldValue, value) {
    this.$('pollaris-listitems').items = value;
  }

  update(event) {
    const now = Date.now();
    this.fire(`pollaris-${this.eventname}`, {
      name: now,
      items: this.items.concat({
        content: now,
        due: now + 1000,
      }),
    });
  }

  clear(event) {
    const now = Date.now();
    this.fire(`pollaris-${this.eventname}`, {
      name: now,
      items: [],
    });
  }

  removeFromList(event) {
    const { index } = event.detail;

    const items = this.items.slice();
    items.splice(index, 1);

    this.fire(`pollaris-${this.eventname}`, {
      name: this.name,
      items,
    });
  }
}

customElements.define('pollaris-list', PollarisList);
