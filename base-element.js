const BaseElement = (parent, template = false) => {
  return class extends parent {
    static get observedAttributes() {
      return this.props ? Object.keys(this.props) : [];
    }
    
    constructor() {
      super();
      
      if (template) {
        const fragment = document.createRange().createContextualFragment(template);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(fragment);
        this.$ = this.shadowRoot;
      }
      
      this._props = {}; Object.assign({}, this.constructor.props);
      
      if (this.constructor.props) {
        Object.keys(this.constructor.props).forEach((propName) => {
          this._props[propName] = Object.assign({}, this.constructor.props[propName]);
          this.set(propName, this.constructor.props[propName].value);
        });
      }
    }
    
    connectedCallback() {}
    
    disconnectedCallback() {}
    
    set(propName, value) {
      if (this._props[propName].reflectToAttribute) {
        this.setAttribute(propName, value);
      } else {
        this.setProp(propName, this[propName], value);
      }
    }
    
    setProp(propName, oldValue, value) {
      let adjustedNewValue = value;
      
      switch (this._props[propName].type) {
        case String:
          adjustedNewValue = `${value}`;
          break;
        case Number:
          adjustedNewValue = Number(value);
        default:
          break;
      }
      
      this[propName] = adjustedNewValue;
      
      if (this[this._props[propName].observer]) {
        this[this._props[propName].observer](oldValue, this[propName]);
      }
    }

    attributeChangedCallback(name, oldValue, value) {
      this.setProp(name, oldValue, value);
    }  
    
    on(el, type, func) {
      el.addEventListener(type, func);
    }
    
    off(el, type, func) {
      el.removeEventListener(type, func);
    }
    
    fire(type, detail, bubbles = true, composed = true) {
      this.dispatchEvent(new CustomEvent(type, {
        bubbles,
        composed,
        detail,
      }));
    }
  }
}

export default BaseElement;