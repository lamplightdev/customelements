import BaseElement from './base-element.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<span id="content"></span> (<span id="due"></span>)
`;

class PollarisListItem extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      due: {
        type: Number,
        value: '',
        observer: 'observeDue',
      },

      content: {
        type: String,
        value: '',
        observer: 'observeContent',
      },
    };
  }

  observeDue(oldValue, value) {
    this.$id['due'].textContent = new Date(value);
  }

  observeContent(oldValue, value) {
    this.$id['content'].textContent = value;
  }
}

customElements.define('pollaris-listitem', PollarisListItem);
