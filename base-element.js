const BaseElement = (parent, template = false) => {
  return class extends parent {
    static get observedAttributes() {
      return this.props ? Object.keys(this.props) : [];
    }

    constructor() {
      super();

      if (template) {
        this.attachShadow({mode: 'open'});
        let instance;

        const htmlTemplate = this._makeTemplate`${template}`;

        if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
          window.ShadyCSS.prepareTemplate(htmlTemplate, this.nodeName.toLowerCase());
          window.ShadyCSS.styleElement(this);
        }

        instance = htmlTemplate.content.cloneNode(true);

        this.shadowRoot.appendChild(instance);

        this.$s = this.shadowRoot;
        this.$ = this.$s.querySelector.bind(this.$s);
        this.$$ = this.$s.querySelectorAll.bind(this.$s);
        this.$id = {};

        this.$$('[id]').forEach((el) => {
          this.$id[el.id] = el;
        });
      }

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

    connectedCallback() {
      if (this.$) {
        const eventTypes = [];
        for (let property in this) {
          const match = property.match(/^on(.*)/)
          if (match) {
            eventTypes.push(match[1]);
          }
        }

        eventTypes.forEach((eventType) => {
          const attr = `on-${eventType}`;

          this.$$(`[${attr}]`).forEach((el) => {
            this.on(el, eventType, this[el.getAttribute(attr)].bind(this));
          });
        });
      }
    }

    disconnectedCallback() {
      if (this.$) {
        const eventTypes = [];
        for (let property in this) {
          const match = property.match(/^on(.*)/)
          if (match) {
            eventTypes.push(match[1]);
          }
        }

        eventTypes.forEach((eventType) => {
          const attr = `on-${eventType}`;

          this.$$(`[${attr}]`).forEach((el) => {
            this.off(el, eventType, this[el.getAttribute(attr)]);
          });
        });
      }
    }

    _makeTemplate (strings, ...substs) {
      let html = '';
      for (let i = 0; i < substs.length; i++) {
          html += strings[i];
          html += substs[i];
      }
      html += strings[strings.length - 1];
      const template = document.createElement('template');
      template.innerHTML = html;
      return template;
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
