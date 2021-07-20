import './style.scss';
import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import Header from '../../components/header.js';
import EditorForm from './editorForm/index.js';
import { EDITOR_STATE } from '../../configs/constants.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = EDITOR_STATE;
  }

  getTemplate () {
    return `
        <div id="main__header"></div>
        <div id="main__contents"></div>
    `;
  }

  mountChildren () {
    const { requestAddPosting, onChangeInput } = this;

    const $header = _.$('#main__header');
    const $contens = _.$('#main__contents');

    new Header($header, {
      type: 'write',
      title: '글쓰기',
      handlerClickRightIcon: requestAddPosting.bind(this)
    });

    new EditorForm($contens, { ...this.state, onChangeInput: onChangeInput.bind(this) });
  }

  requestAddPosting () {
    const state = this.state;
    console.log(`state : ${state}`);
  }

  onChangeInput (newContents) {
    this.setState(newContents);
    console.log(this.state)
    console.log('변경');
  }

  setEventListener () {}
}

new App($root);
