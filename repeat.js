const PollarisRepeat = (parent, repeatProperty = 'items') => {
  return class extends parent {
    // TODO: key items?

    getKey(item, index) {
      return index;
    }

    initItemInstance(value, instance, index) {}
    updateItemInstance(value, el, index) {}

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

      eventTypes.forEach((eventType) => {
        const attr = `on-${eventType}`;

        instance.querySelectorAll(`[${attr}]`).forEach((el) => {
          this.on(el, eventType, this[el.getAttribute(attr)].bind(this, value, index));
        });
      });

      return instance;
      //output.appendChild(instance);
    }

    _updateItem(el, value, index) {
      return this.updateItemInstance(value, el, index);
    }

    _removeItem(output, el) {
      output.removeChild(el);
    }

    observeItems(oldValues, values) {
      const template = this.$('template');
      const output = this.$('.output');

      const keyedValues = values.map((value, index) => {
        return {
          ...value,
          key: this.getKey(value, index),
        };
      })

      const newKeys = keyedValues.map(value => value.key);
      const existingKeys = [...output.children].map(el => el.key);

      existingKeys.forEach((existingKey) => {
        if (newKeys.indexOf(existingKey) === -1) {
          const el = [...output.children].find(el => el.key === existingKey);
          this._removeItem(output, el);
        }
      });

      const addedElements = [];
      const updatedElements = [];
      const orderedElements = [];

      newKeys.forEach((newKey) => {
        const index = keyedValues.findIndex(value => value.key === newKey);

        let el;
        if (existingKeys.indexOf(newKey) === -1) {
          el = this._addItem(template, values[index], output, index);
          addedElements.push(el);
        } else {
          const existingEl = [...output.children].find(el => el.key === newKey);
          el = this._updateItem(existingEl, values[index], index);
          updatedElements.push(el);
        }

        orderedElements.push(el);
      });

      orderedElements.forEach((newChild, index) => {
        const existingChild = output.children[index];

        if (existingChild) {
          if (newChild.key !== existingChild.key) {
            output.insertBefore(newChild, existingChild);
            /*
            if (addedElements.find(el => el === newChild)) {
            } else { // if (updatedElements.find(el => el === newChild)) {
              output
            }
            */
          }
        } else {
          output.appendChild(newChild);
        }
      });
    }
  };
};

export default PollarisRepeat;
