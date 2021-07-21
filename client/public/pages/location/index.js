import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import './style.scss';
import Header from '../../components/header.js';

const $root = document.querySelector('#root');

export default class App extends Component {
  initState () {
    this.state = {
      isOpenModal: false,
      townList: [{ id: '1', title: '방이동' }]
    };
  }

  getTemplate () {
    const { isOpenModal, townList } = this.state;
    return `
      <div id="town__header"></div>
      <div id="town__contents">
        <p>지역은 최소 1개 이상 <br/>
        최대 2개까지 설정 가능해요.</p>
        <ul id="town__town-buttons">
          ${townList
            .map(
              ({ id, title }) =>
                `<li class="btn small location active">
                  <div>${title}</div>
                  <div class="wmi-close"></div>
                </li>`
            )
            .join('')}
          ${
            townList.length < 2
              ? '<li class="btn small location wmi-add"></li>'
              : ''
          }
        </ul>
      </div>
      ${isOpenModal ? '<div id="town__modal"></div>' : ''}
    `;
  }

  mountChildren () {
    const { isOpenModal } = this.state;

    const $header = _.$('#town__header');
    const $contents = _.$('#town__contents');

    new Header($header, { title: '내 동네 설정하기' });

    if (isOpenModal) {
      const $modal = _.$('#town__modal');
    }
  }

  didMount () {}
  setEventListener () {}
}

new App($root);
