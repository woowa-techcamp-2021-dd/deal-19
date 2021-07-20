import './style.scss';
import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import Header from '../../components/header.js';
import EditorForm from './editorForm/index.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = { location: '역삼동' };
  }

  getTemplate () {
    return `
        <div id="main__header"></div>
        <div id="main__contents"></div>
    `;
  }

  mountChildren () {
    const { requestAddPosting } = this;
    const { location } = this.state;

    const $header = _.$('#main__header');
    const $contens = _.$('#main__contents');

    new Header($header, {
      type: 'write',
      title: '글쓰기',
      handlerClickRightIcon: requestAddPosting.bind(this)
    });

    new EditorForm($contens, { location });
  }

  requestAddPosting () {
    console.log('글쓰기 요청');
  }

  setEventListener () {}
}

new App($root);
