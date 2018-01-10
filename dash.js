import FullMixin from './full-mixin.js';

const template = `
<style>
  :host {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid steelblue;
    padding: 1rem;

    position: relative;
  }

  #move {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    border: 1px solid black;

    user-select: none;
  }
</style>

<slot></slot>

<div id="move" on-mousedown="resizeStart">Move</div>
`;

class PollarisDash extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      width: {
        type: Number,
        value: 0,
        observer: 'observeWidth',
      },

      height: {
        type: Number,
        value: 0,
        observer: 'observeHeight',
      },
    };
  }

  constructor() {
    super();

    this.resizeMove = this.resizeMove.bind(this);
    this.resizeEnd = this.resizeEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(window, 'mousemove', this.resizeMove);
    this.on(window, 'mouseup', this.resizeEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.off(window, 'mousemove', this.resizeMove);
    this.off(window, 'mouseup', this.resizeEnd);
  }

  resizeStart(event) {
    this.resizing = {
      width: this.width,
      height: this.height,
      x: event.clientX,
      y: event.clientY,
    };
  }

  resizeMove(event) {
    if (this.resizing) {
      const end = {
        x: event.clientX,
        y: event.clientY,
      };

      cancelAnimationFrame(this.resizeTimer);

      this.resizeTimer = requestAnimationFrame(() => {
        this.resizeTo(
          this.resizing.width + (end.x - this.resizing.x),
          this.resizing.height + (end.y - this.resizing.y),
        );
      });
    }
  }

  resizeEnd(event) {
    if (this.resizing) {
      this.resizing = false;
    }
  }

  resizeTo(width, height) {
    this.fire('dashresizeto', {
      width: Math.round(width / 20) * 20,
      height: Math.round(height / 20) * 20,
    });
  }

  observeWidth(oldValue, value) {
    this.style.width = `${value}px`;
  }

  observeHeight(oldValue, value) {
    this.style.height = `${value}px`;
  }
}

customElements.define('pollaris-dash', PollarisDash);
