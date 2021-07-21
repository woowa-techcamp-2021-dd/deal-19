import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import './style.scss';
import Header from '../../components/header.js';
import Modal from '../../components/modal.js';
import request from '../../utils/fetchWrapper.js';
import { TOWN_ENDPOINT } from '../../configs/endpoints.js';
const $root = document.querySelector('#root');

export default class App extends Component {
  initState () {
    this.state = {
      isOpenModal: false,
      townList: [{ id: '1', name: '방이동', isActive: true }]
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
              ({ id, name, isActive }) =>
                `<li class="btn small location ${isActive ? 'active' : ''}" data-id=${id}>
                  <div>${name}</div>
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
    const { registerTown } = this;
    const { isOpenModal } = this.state;

    const $header = _.$('#town__header');

    new Header($header, { title: '내 동네 설정하기' });

    if (isOpenModal) {
      const $modal = _.$('#town__modal');
      new Modal($modal, { type: 'prompt', text: '우리 동네를 입력하세요', placeholder: '시.구 제외, 동만 입력', action: registerTown.bind(this) });
    }
  }

  setEventListener () {
    this.addEventListener('click', '.btn.location', (e) => {
      const classList = e.target.classList;
      if (classList.contains('wmi-close')) {
        return;
      }
      if (classList.contains('adder')) {
        this.setState({ isOpenModal: true });
        return;
      }

      const $li = e.target.closest('.btn.location');

      if ($li.classList.contains('active')) {
        return;
      }
      this.selectActiveTown($li.dataset.id);
    });
    this.addEventListener('click', '.btn.location > .wmi-close', (e) => {
      const $li = e.target.closest('.btn.location');
      const townId = $li.dataset.id;
      this.deleteTown(townId);
    });
  }

  selectActiveTown (townId) {
    const { townList } = this.state;
    const switchActiveTown = townList.map(town => {
      town.isActive = false;
      if (town.id === townId) town.isActive = true;
      return town;
    }
    );
    this.setState({ townList: switchActiveTown });
  }

  deleteTown (townId) {
    const accessToken = localStorage.getItem('accessToken');
    request(TOWN_ENDPOINT, 'DELETE', {
      body: JSON.stringify({
        townId
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      const { townId } = res;
      const { townList } = this.state;
      const newTownList = activatedTownList(removeTown(townList, townId));
      this.setState({ townList: newTownList, isOpenModal: !newTownList.length });
    }).catch(errorMessage => {
      console.log('err??');
      this.setState({ errorMessage });
    });
  }

  registerTown (townName) {
    const $button = _.$('#modal-confirm');
    $button.setAttribute('disabled', true);
    const accessToken = localStorage.getItem('accessToken');
    const { townList } = this.state;
    request(TOWN_ENDPOINT, 'POST', {
      body: JSON.stringify({
        townName, isActive: !townList.length
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then((result) => {
      const { id, name } = result;
      const newTownList = activatedTownList([...townList, { id, name, isActive: false }]);
      this.setState({ townList: newTownList });
    }).catch((errorMessage) => {
      this.setState({ errorMessage });
    }).finally(() => {
      this.setState({ isOpenModal: false });
    });
    // 이 동네를 유저의 메인 동네 isActive로 등록 요청하고 id, town이름을 응답 받음(id를 서버가 생성하기에)
    //

    // 현재 메인 동네가 없으면 이 동네를 메인으로 등록 (서버와는 별개)
  }

  didMount () {}
}

const removeTown = (townList, townId) => townList.filter(town => town.id !== townId);
const activatedTownList = townList => {
  if (!townList.length) return [];
  const filterd = townList.filter(town => town.isActive);
  if (filterd.length) {
    console.log(townList);
    return townList;
  } else {
    townList[0].isActive = true;
    console.log(townList);
    return townList;
  }
};

new App($root);
