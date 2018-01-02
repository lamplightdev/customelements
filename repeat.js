const PollarisRepeat = (parent) => {
  return class extends parent {
    // TODO: key items?

    _addItem(template, value, output) {
      const instance = template.content.cloneNode(true);

      this.initItemInstance(value, instance);

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
          this._addItem(template, value, output);
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
