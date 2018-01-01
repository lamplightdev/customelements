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

        if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
          const htmlTemplate = this._makeTemplate`${template}`;

          window.ShadyCSS.prepareTemplate(htmlTemplate, this.nodeName.toLowerCase());
          window.ShadyCSS.styleElement(this);

          instance = htmlTemplate.content.cloneNode(true);
        } else {
          instance = document.createRange().createContextualFragment(template);
        }

        this.shadowRoot.appendChild(instance);

        this.$ = this.shadowRoot;
      }

      this._props = {}; // Object.assign({}, this.constructor.props);

      if (this.constructor.props) {
        Object.keys(this.constructor.props).forEach((propName) => {
          this._props[propName] = Object.assign({}, this.constructor.props[propName]);
          if (typeof this[propName] !== 'undefined') {
            const value = this[propName];
            this[propName] = undefined;
            this.set(propName, value);
          } else {
            this.set(propName, this.constructor.props[propName].value, !this.hasAttribute(propName));
          }
        });
      }
    }

    connectedCallback() {

    }

    disconnectedCallback() {}

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

    set(propName, value, allowReflection = true) {
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
      } else {
        this.setProp(propName, this[propName], value);
      }
    }

    setProp(propName, oldValue, value) {
      console.log(propName, oldValue, value);
      if (oldValue === value) return;

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

      this[propName] = adjustedNewValue;

      if (this[this._props[propName].observer]) {
        this[this._props[propName].observer](oldValue, this[propName]);
      }
    }

    attributeChangedCallback(name, oldValue, value) {
      if (this._props[name].type === Boolean) {
        let adjustedOldValue = oldValue;
        let adjustedNewValue = value;
        if (adjustedOldValue !== undefined) {
          adjustedOldValue = adjustedOldValue === '' ? true : false;
        }
        if (adjustedNewValue !== undefined) {
          adjustedNewValue = adjustedNewValue === '' ? true : false;
        }
        this.setProp(name, adjustedOldValue, adjustedNewValue);
      } else {
        this.setProp(name, oldValue, value);
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
