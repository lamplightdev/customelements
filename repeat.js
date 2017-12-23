const PollarisRepeat = (parent,) => {
  return class extends parent {
    observeItems(oldValue, value) {
      const template = this.$.querySelector('template');
      const output = this.$.querySelector('.output');

      output.textContent = '';

      value.forEach((page) => {
        const instance = template.cloneNode(true);
        
        this.initItemInstance(value, instance);

        output.appendChild(instance);
      });
    }
  };
};

export default PollarisRepeat;