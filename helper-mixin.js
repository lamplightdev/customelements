const HelperMixin = (parentElement) => {
  return class extends parentElement {
    constructor() {
      super();

      this._loadedScripts = {};
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.shadowRoot) {
        const eventTypes = [];
        for (let property in this) {
          const match = property.match(/^on(.*)/)
          if (match) {
            eventTypes.push(match[1]);
          }
        }

        eventTypes.forEach((eventType) => {
          const attr = `on-${eventType}`;

          this.shadowRoot.querySelectorAll(`[${attr}]`).forEach((el) => {
            this.on(el, eventType, this[el.getAttribute(attr)].bind(this));
          });
        });
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.shadowRoot) {
        const eventTypes = [];
        for (let property in this) {
          const match = property.match(/^on(.*)/)
          if (match) {
            eventTypes.push(match[1]);
          }
        }

        eventTypes.forEach((eventType) => {
          const attr = `on-${eventType}`;

          this.shadowRoot.querySelectorAll(`[${attr}]`).forEach((el) => {
            this.off(el, eventType, this[el.getAttribute(attr)]);
          });
        });
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

    loadScript(src) {
      if (this._loadedScripts[src]) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const script = document.createElement('script');
          script.setAttribute('type', 'module');

          script.onload = () => {
            this._loadedScripts[src] = true;
            resolve();
          };
          script.src = src;

          document.head.appendChild(script);
        });
      });
    }
  }
};

export default HelperMixin;
