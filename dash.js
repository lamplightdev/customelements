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

  #resize {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    border: 1px solid black;

    user-select: none;
  }

  #move {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    border: 1px solid black;

    user-select: none;

</style>

<slot></slot>

<div id="move" on-mousedown="moveStart">Move</div>
<div id="resize" on-mousedown="resizeStart">Resize</div>
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

      x: {
        type: Number,
        value: 0,
        observer: 'observeX',
      },

      y: {
        type: Number,
        value: 0,
        observer: 'observeY',
      },
    };
  }

  constructor() {
    super();

    this.resizeMove = this.resizeMove.bind(this);
    this.resizeEnd = this.resizeEnd.bind(this);

    this.moveMove = this.moveMove.bind(this);
    this.moveEnd = this.moveEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.on(window, 'mousemove', this.resizeMove);
    this.on(window, 'mouseup', this.resizeEnd);

    this.on(window, 'mousemove', this.moveMove);
    this.on(window, 'mouseup', this.moveEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.off(window, 'mousemove', this.resizeMove);
    this.off(window, 'mouseup', this.resizeEnd);

    this.off(window, 'mousemove', this.moveMove);
    this.off(window, 'mouseup', this.moveEnd);
  }

  resizeStart(event) {
    this.resizing = {
      width: (this.width / 100) * this.parentNode.offsetWidth,
      height: this.height,
      x: event.clientX,
      y: event.clientY,
    };
  }

  resizeMove(event) {
    if (this.resizing) {
      const to = {
        width: this.resizing.width + (event.clientX - this.resizing.x),
        height: this.resizing.height + (event.clientY - this.resizing.y),
      };

      cancelAnimationFrame(this.resizeTimer);

      this.resizeTimer = requestAnimationFrame(() => {
        this.resizeTo(to.width, to.height);
      });
    }
  }

  resizeEnd(event) {
    if (this.resizing) {
      this.resizing = false;
    }
  }

  resizeTo(width, height) {
    const parentWidth = this.parentNode.offsetWidth;

    let newWidth = (width / parentWidth) * 100;
    newWidth = Math.round(newWidth / 5) * 5;
    const newHeight = Math.round(height / 20) * 20;

    if (this.width === newWidth && this.height === newHeight) return;

    const x = (this.width / 100) * parentWidth * (this.x / 100);
    const factor = ((5 / 100) * parentWidth * (newWidth / parentWidth)).toFixed(2);
    const xPx = Math.round(x / factor) * factor

    const newX = x / ((newWidth / 100) * parentWidth) * 100

    this.fire('dashmoveto', {
      x: newX,
      y: this.y,
    });

    this.fire('dashresizeto', {
      width: newWidth,
      height: newHeight,
    });
  }

  moveStart(event) {
    this.moving = {
      x: (this.x / 100) * this.offsetWidth,
      y: this.y,
      xStart: event.clientX,
      yStart: event.clientY,
    };
  }

  moveMove(event) {
    if (this.moving) {
      const to = {
        x: this.moving.x + (event.clientX - this.moving.xStart),
        y: this.moving.y + (event.clientY - this.moving.yStart),
      };

      cancelAnimationFrame(this.moveTimer);

      this.moveTimer = requestAnimationFrame(() => {
        this.moveTo(to.x, to.y);
      });
    }
  }

  moveEnd(event) {
    if (this.moving) {
      this.moving = false;
    }
  }

  moveTo(x, y) {
    const parentWidth = this.parentNode.offsetWidth;

    console.log(parentWidth);
    const factor = ((5 / 100) * parentWidth).toFixed(2);
    console.log(factor);
    const adjustedX = Math.round(x / factor) * factor;
    let newX = (adjustedX / this.offsetWidth) * 100;

    const newY = Math.round(y / 20) * 20;

    if (this.x === newX && this.y === newY) return;

    this.fire('dashmoveto', {
      x: newX,
      y: newY,
    });
  }

  observeWidth(oldValue, value) {
    this.style.width = `${value}%`;
  }

  observeHeight(oldValue, value) {
    this.style.height = `${value}px`;
  }

  observeX(oldValue, value) {
    this.style.transform = `translate(${value}%, ${this.y}px)`;
  }

  observeY(oldValue, value) {
    this.style.transform = `translate(${this.x}%, ${value}px)`;
  }
}

customElements.define('pollaris-dash', PollarisDash);
