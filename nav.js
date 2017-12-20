import BaseElement from './base-element.js';

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

<div id="links">
  <template>
    <a href=""></a>
  </template>
  
  <div class="output"></div>
</div>
`;


class PollarisNav extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      active: {
        type: String,
        value: '',
        observer: 'observeActive',
      },
      
      pages: {
        type: Array,
        value: [],
        observer: 'observePages',
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
      this.$.querySelector('#links').querySelector(`a#${oldValue}`).classList.remove('active');
    }
    
    if (value) {
      this.$.querySelector('#links').querySelector(`a#${value}`).classList.add('active');
    }
  }
  
  observePages(oldValue, value) {
    const linksEl = this.$.querySelector('#links');
    const linkTemplate = linksEl.querySelector('template');
    const output = linksEl.querySelector('.output');
    
    output.textContent = '';
    
    value.forEach((page) => {
      const instance = linkTemplate.content.cloneNode(true);
      const link = instance.querySelector('a');
      
      link.textContent = page.name;
      link.id = page.id;
      
      this.on(link, 'click', (event) => {
        event.preventDefault();
        
        this.fire('pollaris-updatepage', {
          pageId: page.id,
        });
      });
      
      output.appendChild(instance);
    });
  }
}

customElements.define('pollaris-nav', PollarisNav);