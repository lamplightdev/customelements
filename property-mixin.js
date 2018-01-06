const PropertyMixin = (parentElement, template = false) => {
  return class extends parentElement {
    static get observedAttributes() {
      return this.props ? Object.keys(this.props) : [];
    }

    constructor() {
      super();

      this._props = {};

      if (this.constructor.props) {
        Object.keys(this.constructor.props).forEach((propName) => {
          this._props[propName] = Object.assign({}, this.constructor.props[propName]);

          let value;
          if (typeof this[propName] !== 'undefined') {
            value = this[propName];
          } else {
            value = this.constructor.props[propName].value
          }

          // define property setter and getter after we have accessed raw property above
          Object.defineProperty(this, propName, {
            get: () => { return this._props[propName].value; },
            set: (value) => { this.set(propName, value); },
          });

          this.set(propName, value, !this.hasAttribute(propName), true);
        });
      }
    }

    set(propName, value, allowReflection = true, fromInitialisation = false) {
      if (allowReflection && this._props[propName].reflectToAttribute) {

        let adjustedNewValue = value;

        switch (this._props[propName].type) {
          case String:
            adjustedNewValue = `${value}`;
            break;
          case Number:
            adjustedNewValue = Number(value);
            break;
          case Boolean:
            adjustedNewValue = !!value;
            break;
          case Object: case Array:
            adjustedNewValue = JSON.stringify(value);
            break;
          default:
            break;
        }

        if (this._props[propName].type === Boolean) {
          if (adjustedNewValue) {
            this.setAttribute(propName, '');
          } else {
            this.removeAttribute(propName);
          }
        } else {
          this.setAttribute(propName, adjustedNewValue);
        }

        if (fromInitialisation) {
          // attributeChangedCallback isn't called on initialisation of an attribute
          // so ensure it's set here
          this.setProp(propName, this[propName], value, true);
        }
      } else {
        this.setProp(propName, this[propName], value, fromInitialisation);
      }
    }

    setProp(propName, oldValue, value, fromInitialisation = false) {
      if (!fromInitialisation && oldValue === value) return;

      let adjustedNewValue = value;

      switch (this._props[propName].type) {
        case String:
          adjustedNewValue = `${value}`;
          break;
        case Number:
          adjustedNewValue = Number(value);
          break;
        case Boolean:
          adjustedNewValue = !!value;
          break;
        default:
          break;
      }

      this._props[propName].value = adjustedNewValue;

      if (this[this._props[propName].observer]) {
        this[this._props[propName].observer](oldValue, this[propName], fromInitialisation);
      }
    }

    attributeChangedCallback(name, oldValue, value) {
      switch (this._props[name].type) {
        case Boolean: {
          let adjustedOldValue = oldValue;
          let adjustedNewValue = value;
          if (adjustedOldValue !== undefined) {
            adjustedOldValue = adjustedOldValue === '' ? true : false;
          }
          if (adjustedNewValue !== undefined) {
            adjustedNewValue = adjustedNewValue === '' ? true : false;
          }
          this.setProp(name, adjustedOldValue, adjustedNewValue);
          break;
        }
        case Object: case Array: {
          this.setProp(name, JSON.parse(oldValue), JSON.parse(value));
          break;
        }
        default:
          this.setProp(name, oldValue, value);
          break;
      }
    }
  }
};

export default PropertyMixin;
