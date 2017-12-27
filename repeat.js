const PollarisRepeat = (parent) => {
  return class extends parent {
    observeItems(oldValues, values) {
      const template = this.$.querySelector('template');
      const output = this.$.querySelector('.output');

      output.textContent = '';

      values.forEach((value) => {
        const instance = template.content.cloneNode(true);
        
        this.initItemInstance(value, instance);

        output.appendChild(instance);
      });
    }
  };
};

export default PollarisRepeat;