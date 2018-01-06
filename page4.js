import FullMixin from './full-mixin.js';

const template = `
<style>
  :host {
    display: block;
  }

  #signed-in, #signed-out {
    display: none;
  }

  :host(.signed-in) #signed-in {
    display: block;
  }

  :host(.signed-out) #signed-out {
    display: block;
  }
</style>

<div id="signed-in">
  Signed in as <span id="user-email"></span>
  <button id="signout" on-click="signOut">Sign out</button>
</div>

<div id="signed-out">
  <button id="signin" on-click="signIn">Sign in with Google</button>
</div>
`;

class PollarisPage4 extends FullMixin(HTMLElement, template) {
  static get props() {
    return {
      user: {
        type: Object,
        value: null,
        observer: 'observeUser',
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  observeUser(oldValue, value) {
    if (value) {
      this.classList.add('signed-in');
      this.classList.remove('signed-out');

      this.showUserDetails(this.user);
    } else {
      this.classList.remove('signed-in');
      this.classList.add('signed-out');
    }
  }

  showUserDetails(user) {
    this.$id['user-email'].textContent = user.email;
  }

  signIn() {
    this.fire('pollaris-usersignin');
  }

  signOut() {
    this.fire('pollaris-usersignout');
  }
}

customElements.define('pollaris-page4', PollarisPage4);
