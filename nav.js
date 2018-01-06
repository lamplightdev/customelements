import FullMixin from './full-mixin.js';
import PollarisRepeat from './repeat.js';

const template = `
<style>
  :host {
    display: block;
    padding: 5px;
  }

  a {
    color: red;
  }

  a.active {
    text-decoration: none;
  }
</style>

<template>
  <a href="" on-click="navigate"></a>
</template>

<div class="output"></div>
`;

class PollarisNav extends PollarisRepeat(FullMixin(HTMLElement, template)) {
  static get props() {
    return {
      active: {
        type: String,
        value: '',
        observer: 'observeActive',
      },

      items: {
        type: Array,
        value: [],
        observer: 'observeItems',
      },
    };
  }

  observeActive(oldValue, value) {
    if (oldValue) {
      this.$(`a#${oldValue}`).classList.remove('active');
    }

    if (value) {
      this.$(`a#${value}`).classList.add('active');
    }
  }

  initItemInstance(item, instance) {
    const link = instance.querySelector('a');

    link.setAttribute('href', `#${item.id}`);
    link.textContent = item.name;
    link.id = item.id;
  }

  navigate(item, index, event) {
    event.preventDefault();

    this.fire('pollaris-updatepage', {
      pageId: item.id,
    });
  }

  updateItemInstance(item, index) {}
}

customElements.define('pollaris-nav', PollarisNav);
