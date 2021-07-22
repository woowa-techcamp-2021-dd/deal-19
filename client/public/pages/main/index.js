import Component from '../../core/component.js';

import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';

import Main from './main.js';
import Login from './login/index.js';

import { AUTH_ENDPOINT } from '../../configs/endpoints.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      isValidToken: false,
      userID: ''
    };
  }

  getTemplate () {
    return '<div id="app"></div>';
  }

  mountChildren () {
    const $app = _.$('#app');
    const { signIn, signOut } = this;
    const { isValidToken, userID } = this.state;

    if (isValidToken) {
      new Main($app, { signOut: signOut.bind(this), userID });
    } else {
      new Login($app, { signIn: signIn.bind(this) });
    }
  }

  didInitialMount () {
    requestUserID.call(this);
  }

  // Custom Methods
  signIn (userID) {
    this.setState({ isValidToken: true, userID });
  }

  signOut () {
    this.setState({ isValidToken: false });
    window.localStorage.removeItem('_at');
  }
}

function requestUserID () {
  const token = window.localStorage.getItem('_at');

  request(AUTH_ENDPOINT, 'GET', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((result) => {
      const { userID } = result;

      this.signIn(userID);
    });
}

new App($root);
