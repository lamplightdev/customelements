const ShadowMixin = (parentElement, template = false) => {
  return class extends parentElement {
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
  }
};

export default ShadowMixin;
