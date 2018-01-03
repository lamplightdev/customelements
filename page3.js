import BaseElement from './base-element.js';
import './list.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-list id="list"></pollaris-list>
<pollaris-list id="hn"></pollaris-list>
`;

class PollarisPage3 extends BaseElement(HTMLElement, template) {
  static get props() {
    return {
      list: {
        type: Object,
        value: {
          name: 'My List',
          items: [],
        },
        observer: 'observeList',
      },

      hn: {
        type: Object,
        value: {
          name: 'Top Stories',
          items: [],
        },
        observer: 'observeHN',
      },
    };
  }

  async connectedCallback() {
    super.connectedCallback();

    const storyIDs = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json());

    const topStoryIDs = storyIDs.slice(0, 5);

    const stories = await Promise.all(topStoryIDs.map((ID) => {
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${ID}.json`)
        .then(response => response.json());
    }));

    this.set('hn', {
      name: this.hn.name,
      items: stories,
    });
  }

  observeList(oldValue, value) {
    const list = this.$.querySelector('#list');

    list.set('name', this.list.name);
    list.set('items', this.list.items);
  }

  observeHN(oldValue, value) {
    const hn = this.$.querySelector('#hn');

    hn.set('items', this.hn.items.map((item) => {
      return {
        content: item.title,
        due: item.time,
      };
    }));
  }
}

customElements.define('pollaris-page3', PollarisPage3);