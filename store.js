import FullMixin from './full-mixin.js';

class PollarisStore extends FullMixin(HTMLElement) {
  static get props() {
    return {
      db: {
        type: Object,
        value: null,
      },
      debounceduration: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
    };
  }

  listen() {
    this.unsubscribe = this.db
      .collection(this.getAttribute('name'))
      .doc('me')
      .onSnapshot((doc) => {
        let data = null;

        if (doc.exists) {
          data = doc.data();
        }

        this.fire('pollaris-storeupdate', {
          name: this.getAttribute('name'),
          data,
        });
      });
  }

  unlisten() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  retrieve() {
    return this.db
      .collection(this.getAttribute('name'))
      .doc('me')
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        }

        return null;
      });
    //return Promise.resolve().then(() => this.store);
  }

  update(store) {
    cancelAnimationFrame(this.timer);

    this.timer = setTimeout(() => {
      this.db
        .collection(this.getAttribute('name'))
        .doc('me')
        .set(store);
    }, this.debounceduration);

    return

    /*
    return Promise.resolve().then(() => {
      localStorage.setItem(`pollaris-${this.getAttribute('name')}`, JSON.stringify(store));

      this.store = store;
    });
    */
  }
}

customElements.define('pollaris-store', PollarisStore);
