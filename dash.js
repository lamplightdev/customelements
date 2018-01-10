import FullMixin from './full-mixin.js';

const template = `
<style>
  :host {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid steelblue;
    padding: 1rem;

    width: 200px;
    height: 200px;
  }
</style>

<slot></slot>
`;

class PollarisDash extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      content: {
        type: String,
        value: '',
        observer: 'observeContent',
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(this, 'click', this.fireDash);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.off(this, 'click', this.fireDash);
  }

  fireDash() {
    this.fire('pollaris-dash');
  }

  observeContent(oldValue, value) {
  }
}

customElements.define('pollaris-dash', PollarisDash);
