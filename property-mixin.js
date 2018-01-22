const PropertyMixin = (parentElement, template = false) => {
  return class extends parentElement {
    static get props() { }

    static get observedAttributes() {
      return Object.keys(this.props);
    }

    constructor() {
      super();

      this._props = {};
      this._ignoreNextAttributeChange = {};

      Object.keys(this.constructor.props).forEach((propName) => {
        Object.defineProperty(this, propName, {
          get: () => { return this._props[propName]; },
          set: (value) => { this.set(propName, value); },
        });

        if (!this.hasAttribute(propName)) {
          this[propName] = this.constructor.props[propName].value;
        }
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (!this._ignoreNextAttributeChange[name]) {
        switch (this.constructor.props[name].type) {
          case Number:
            this[name] = Number(newValue);
            break;
          case Boolean:
            this[name] = newValue === null ? false : true;
            break;
          case Array: case Object:
            this[name] = JSON.parse(newValue);
            break;
          default:
            this[name] = newValue;
            break;
        }
      }

      this._ignoreNextAttributeChange[name] = false;
    }

    set(propName, value) {
      const oldValue = this._props[propName];

      this._props[propName] = value;

      if (oldValue !== this[propName]) {
        if (this.constructor.props[propName].reflectToAttribute) {
          this._ignoreNextAttributeChange[propName] = true;

          if (this[propName] === null) {
            this.removeAttribute(propName);
          } else {
            switch (this.constructor.props[propName].type) {
              case Boolean:
                if (this[propName]) {
                  this.setAttribute(propName, '');
                } else {
                  this.removeAttribute(propName)
                }
                break;
              case Array: case Object:
                this.setAttribute(propName, JSON.stringify(this[propName]));
                break;
              default:
                this.setAttribute(propName, this[propName]);
                break;
            }
          }
        }

        if (this.constructor.props[propName].observer) {
          this[this.constructor.props[propName].observer](oldValue, this[propName]);
        }
      }
    }
  }
};

export default PropertyMixin;
