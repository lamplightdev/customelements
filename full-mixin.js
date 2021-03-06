import ShadowMixin from './shadow-mixin.js';
import PropertyMixin from './property-mixin.js';
import HelperMixin from './helper-mixin.js';

import Styles from './styles.js';

const FullMixin = (parentElement, template = false) => {
  return HelperMixin(PropertyMixin(ShadowMixin(class el extends parentElement {
    connectedCallback() {}
    disconnectedCallback() {}
  }, template, Styles)));
};

export default FullMixin;
