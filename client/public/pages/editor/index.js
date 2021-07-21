import './style.scss';
import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import Header from '../../components/header.js';
import EditorForm from './editorForm/index.js';
import { EDITOR_STATE } from '../../configs/mock.data.js';
import { ITEMS_ENDPOINT } from '../../configs/endpoints.js';
import request from '../../utils/fetchWrapper.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      imageList: [],
      name: '',
      category: { id: '', title: '' },
      price: 0,
      categoryList: [],
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
    const $contens = _.$('#main__contents');

    new Header($header, {
      type: 'write',
      title: '글쓰기',
      handlerClickRightIcon: requestAddPosting.bind(this)
    });

    new EditorForm($contens, { ...this.state, onChangeInput: onChangeInput.bind(this) });
  }

  requestAddPosting () {
    const { name, content, category, price } = this.state;
    const accessToken = localStorage.getItem('accessToken');

    request(ITEMS_ENDPOINT, 'POST', {
      body: JSON.stringify({
        name, categoryID: category.id, price, content
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      window.location.href = '/productDetail';
    }).catch((err) => {
      this.setState({ errorMessage: err });
    }).finally(() => {
      // finally
    });
  }

  didMount () {
    console.log('마운트 후 실행');
    const { imageList, name, category, categoryList, price, content, location } = EDITOR_STATE;
    this.setState({ imageList, name, category, categoryList, price, content, location }, true);
  }

  onChangeInput (newContents) {
    this.setState(newContents);
  }

  setEventListener () {}
}

new App($root);
