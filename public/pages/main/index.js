import Component from '../../core/Component.js';
import './style.scss';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {};
  }

  getTemplate () {
    return `
      <div></div>
    `;
  }

  mountChildren () {

  }

  setEventListener () {

  }
}

new App($root);
