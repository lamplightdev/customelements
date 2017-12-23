import BaseElement from './base-element.js';
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
  <a href=""></a>
</template>

<div class="output"></div>
`;

const repeater = () => {
};


class PollarisNav extends PollarisRepeat(BaseElement(HTMLElement, template)) {
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
  
  constructor() {
    super();
  }
  
  connectedCallback() {
    super.connectedCallback();

  }
  
  observeActive(oldValue, value) {
    if (oldValue) {
      this.$.querySelector(`a#${oldValue}`).classList.remove('active');
    }
    
    if (value) {
      this.$.querySelector(`a#${value}`).classList.add('active');
    }
  }
  
  initItemInstance(item, instance) {
    instance.textContent = item.name;
    instance.id = item.id;

    this.on(instance, 'click', (event) => {
      event.preventDefault();

      this.fire('pollaris-updatepage', {
        pageId: item.id,
      });
    });
  }
}

customElements.define('pollaris-nav', PollarisNav);