import Component from '../../core/component.js';

import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';
import checkTokenValidity from '../../utils/checkTokenValidity.js';

import Header from '../../components/header/header.js';
import EditorForm from './editorForm/index.js';

import { PRODUCTS_ENDPOINT } from '../../configs/endpoints.js';

import './style.scss';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      imageList: [],
      name: '',
      category: { id: '', title: '' },
      price: 0,
      content: '',
      location: '',
      errorMessage: ''
    };
  }

  getTemplate () {
    const { errorMessage } = this.state;

    return `
        <div id="main__header"></div>
        <div id="main__contents"></div>
        ${errorMessage ? '<div>에러 모달</div>' : ''}
    `;
  }

  mountChildren () {
    const { requestAddPosting, onChangeInput } = this;

    const $header = _.$('#main__header');
    const $contents = _.$('#main__contents');

    new Header($header, {
      type: 'write',
      title: '글쓰기',
      handlerClickRightIcon: requestAddPosting.bind(this)
    });

    new EditorForm($contents, { ...this.state, onChangeInput: onChangeInput.bind(this) });
  }

  didInitialMount () {
    checkTokenValidity((success) => {
      if (success) {
        const token = window.localStorage.getItem('_at');
        this.requestTownList(token);
      } else {
        window.localStorage.removeItem('_at');
        window.location.replace('/');
      }
    });
  }

  requestAddPosting () {
    const { name, content, category, price } = this.state;
    const accessToken = localStorage.getItem('_at');

    request(PRODUCTS_ENDPOINT, 'POST', {
      body: JSON.stringify({
        name, categoryID: category.id, price, content
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      window.location.replace(`/productDetail/${response.pid}`);
    }).catch((err) => {
      this.setState({ errorMessage: err });
    }).finally(() => {
      // finally
    });
  }

  onChangeInput (newContents) {
    this.setState(newContents);
  }

  setEventListener () {}
}

new App($root);
