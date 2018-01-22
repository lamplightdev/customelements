const PollarisRepeat = (parent, repeatProperty = 'items') => {
  return class extends parent {
    // TODO: key items?

    constructor() {
      super();

      this._repeatBoundEvents = {};
    }

    getKey(item, index) {
      return index;
    }

    initItemInstance(value, instance, index) {}

    updateItemInstance(value, el, index) {
      return el;
    }

    updateItemProps(el, item) {}

    _addItem(template, value, output, index) {
      const instance = template.content.cloneNode(true);

      const repeatEl = this.initItemInstance(value, instance, index);
      repeatEl.key = this.getKey(value, index);

      const eventTypes = [];
      for (let property in this) {
        const match = property.match(/^on(.*)/)
        if (match) {
          eventTypes.push(match[1]);
        }
      }

      this._repeatBoundEvents[repeatEl.key] = [];

      eventTypes.forEach((eventType) => {
        const attr = `on-${eventType}`;

        instance.querySelectorAll(`[${attr}]`).forEach((el) => {
          const event = {
            el,
            eventType,
            fn: this[el.getAttribute(attr)].bind(this, value, index),
          };

          this.on(el, eventType, event.fn);

          this._repeatBoundEvents[repeatEl.key].push(event);
        });
      });

      return repeatEl;
    }

    _updateItem(el, value, index) {
      return this.updateItemInstance(value, el, index);
    }

    _removeItem(output, el) {
      this._repeatBoundEvents[el.key].forEach((boundEvent) => {
        this.off(boundEvent.el, boundEvent.eventType, boundEvent.fn);
      });

      output.removeChild(el);
    }

    observeItems(oldValues, values) {
      const template = this.$('template');
      const output = this.$('.output');

      const keyedValues = values.map((value, index) => {
        return Object.assign({}, value, {
          key: this.getKey(value, index),
        });
      });

      const newKeys = keyedValues.map(value => value.key);
      const existingKeys = [...output.children].map(el => el.key);

      existingKeys.forEach((existingKey) => {
        if (newKeys.indexOf(existingKey) === -1) {
          const el = [...output.children].find(el => el.key === existingKey);
          this._removeItem(output, el);
        }
      });

      const orderedElements = [];

      newKeys.forEach((newKey) => {
        const index = keyedValues.findIndex(value => value.key === newKey);

        let el;
        if (existingKeys.indexOf(newKey) === -1) {
          el = this._addItem(template, values[index], output, index);
        } else {
          const existingEl = [...output.children].find(el => el.key === newKey);
          el = this._updateItem(existingEl, values[index], index);
        }

        orderedElements.push(el);
      });

      orderedElements.forEach((newChild, index) => {
        const existingChild = output.children[index];

        if (existingChild) {
          if (newChild.key !== existingChild.key) {
            output.insertBefore(newChild, existingChild);
          }
        } else {
          output.appendChild(newChild);
        }

        this.updateItemProps(newChild, values[index]);
      });
    }
  };
};

export default PollarisRepeat;
