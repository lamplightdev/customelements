import FullMixin from './full-mixin.js';

const template = `
<style>
  :host {
    display: inline-block;
  }
</style>

<span></span>
`;

class PollarisTest extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      content: {
        type: String,
        value: '',
        observer: 'observeContent',
      },
    };
  }

  observeContent(oldValue, value) {
    this.$('span').textContent = value;
  }
}

customElements.define('pollaris-test', PollarisTest);
