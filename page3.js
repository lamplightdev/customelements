import FullMixin from './full-mixin.js';
import './list.js';

const template = `
<style>
  :host {
    display: block;
  }
</style>

<pollaris-list id="list"></pollaris-list>
<h3 id="rate"></h3>
<pollaris-list id="hn" eventname="updatehn"></pollaris-list>
`;

class PollarisPage3 extends FullMixin(HTMLElement, template) {
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

      rate: {
        type: Number,
        value: 0,
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

    this.hn = {
      name: this.hn.name,
      items: stories,
    };
  }

  observeList(oldValue, value) {
    const list = this.$id['list'];

    list.name = this.list.name;
    list.items = this.list.items;

    let rate = 0;
    if (list.items.length > 1) {
      rate = list.items.length / ((list.items[list.items.length - 1].due - list.items[0].due) / 1000);
    }

    this.$id.rate.textContent = `${rate}/s`;
  }

  observeHN(oldValue, value) {
    const hn = this.$id['hn'];

    hn.items = this.hn.items.map((item => {
      return {
        content: item.title,
        due: item.url,
      };
    }));
  }
}

customElements.define('pollaris-page3', PollarisPage3);
