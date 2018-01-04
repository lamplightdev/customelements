const PollarisRepeat = (parent) => {
  return class extends parent {
    // TODO: key items?

    _addItem(template, value, output, index) {
      const instance = template.content.cloneNode(true);

      this.initItemInstance(value, instance, index);

      const eventTypes = [];
      for (let property in this) {
        const match = property.match(/^on(.*)/)
        if (match) {
          eventTypes.push(match[1]);
        }
      }

      eventTypes.forEach((eventType) => {
        const attr = `on-${eventType}`;

        instance.querySelectorAll(`[${attr}]`).forEach((el) => {
          this.on(el, eventType, this[el.getAttribute(attr)].bind(this, value, index));
        });
      });

      output.appendChild(instance);
    }

    _updateItem(value, index) {
      this.updateItemInstance(value, index);
    }

    _removeItem(output, index) {
      output.removeChild(output.children[index])
    }

    observeItems(oldValues, values) {
      const template = this.$.querySelector('template');
      const output = this.$.querySelector('.output');

      values.forEach((value, index) => {
        if (!output.children[index]) {
          this._addItem(template, value, output, index);
        } else if (value !== oldValues[index]) {
          this._updateItem(value, index);
        }
      });

      if (oldValues && oldValues.length > values.length) {
        oldValues.slice(values.length).forEach(() => {
          this._removeItem(output, output.children.length - 1);
        });
      }
    }
  };
};

export default PollarisRepeat;
