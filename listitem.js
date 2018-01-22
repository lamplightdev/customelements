import FullMixin from './full-mixin.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<span id="content"></span> (<span id="due"></span>)
`;

class PollarisListItem extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      due: {
        type: String,
        value: '',
        observer: 'observeDue',
      },

      content: {
        type: String,
        value: 'dsd',
        observer: 'observeContent',
      },
    };
  }

  observeDue(oldValue, value) {
    console.log(value);
    this.$id['due'].textContent = value;
  }

  observeContent(oldValue, value) {
    this.$id['content'].textContent = value;
  }
}

customElements.define('pollaris-listitem', PollarisListItem);
