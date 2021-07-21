import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import './style.scss';
import Header from '../../components/header.js';
import Modal from '../../components/modal.js';

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
                `<li class="btn small location active" data-id=${id}>
                  <div>${title}</div>
                  <div class="wmi-close"></div>
                </li>`
            )
            .join('')}
          ${
            townList.length < 2
              ? '<li class="btn small location adder wmi-add"></li>'
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
      new Modal($modal, { type: 'prompt', text: '우리 동네를 입력하세요', placeholder: '시.구 제외, 동만 입력' });
    }
  }

  // active된거 본체 누를때 / active 된거 x 누를 때 / not active 누를 때  / + 누를 때
  setEventListener () {
    this.addEventListener('click', '.btn.location', (e) => {
      const classList = e.target.classList;
      if (classList.contains('wmi-close') || classList.contains('active')) {
        return;
      }

      if (classList.contains('adder')) {
        console.log('open modal');
        this.setState({ isOpenModal: true });
        return;
      }
      console.log('이 동네로 메인 변경');
      // 동네 변경
    });
    this.addEventListener('click', '.btn.location.active > .wmi-close', (e) => {
      console.log('엑스');
      // 이 동네 지우기 요청

      // 지우고 난 후에 동네가 0개라면 동네 추가 모달 띄우기

      // 지워도 하나 남아있다면 그 동네를 메인으로 바꾸기
    });
  }

  didMount () {}
}

new App($root);
