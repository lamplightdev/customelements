import FullMixin from './full-mixin.js';
import './test.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-test content="testing"></pollaris-test>
`;

class TestingApp extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
    }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define('testing-app', TestingApp);
