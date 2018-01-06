const HelperMixin = (parentElement) => {
  return class extends parentElement {
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
  }
};

export default HelperMixin;
