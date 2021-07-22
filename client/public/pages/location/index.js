import Component from '../../core/component.js';

import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';
import checkTokenValidity from '../../utils/checkTokenValidity.js';

import Header from '../../components/header/header.js';
import Modal from '../../components/modal/modal.js';

import { TOWN_ENDPOINT } from '../../configs/endpoints.js';

import './style.scss';

const $root = document.querySelector('#root');

export default class App extends Component {
  initState () {
    this.state = {
      isOpenModal: false,
      townList: []
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
              ({ id, name, isActive }, i, array) =>
                `<li class="btn small location ${isActive ? 'active' : ''}" data-id=${id}>
                  <div>${name}</div>
                  <div class="${isActive ? '' : 'wmi-close'}"></div>
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

    new Header($header, { title: '내 동네 설정하기' });

    if (isOpenModal) {
      const $modal = _.$('#town__modal');
      new Modal($modal, {
        type: 'prompt',
        text: '우리 동네를 입력하세요',
        placeholder: '시.구 제외, 동만 입력',
        action: this.requestTownRegistration.bind(this)
      });
    }
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

      this.requestSwitchActiveTown($li.dataset.id);
    });

    this.addEventListener('click', '.btn.location > .wmi-close', (e) => {
      const $li = e.target.closest('.btn.location');
      const townID = $li.dataset.id;
      this.requestTownDeletion(townID);
    });
  }

  // Custom Methods
  requestSwitchActiveTown (townID) {
    const token = localStorage.getItem('_at');
    request(`${TOWN_ENDPOINT}/${townID}`, 'PUT', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      path: JSON.stringify({
        townID
      })
    }).then(result => {
      const { townID } = result;
      const { townList } = this.state;

      const switchedActiveTownList = townList.map(town => {
        town.isActive = town.id === townID;
        return town;
      });
      this.setState({ townList: switchedActiveTownList });
    });
  }

  requestTownDeletion (townID) {
    const token = localStorage.getItem('_at');

    request(`${TOWN_ENDPOINT}/${townID}`, 'DELETE', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      path: JSON.stringify({
        townID
      })
    }).then(result => {
      const { townID } = result;
      const { townList } = this.state;
      const newTownList = activatedTownList(removeTown(townList, townID));

      this.setState({ townList: newTownList, isOpenModal: !newTownList.length });
    }).catch(errorMessage => {
      this.setState({ errorMessage });
    });
  };

  requestTownRegistration (town) {
    const $button = _.$('#modal-confirm');
    $button.setAttribute('disabled', true);

    const token = localStorage.getItem('_at');
    const { townList } = this.state;

    request(TOWN_ENDPOINT, 'POST', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        town, isActive: !townList.length
      })
    }).then((result) => {
      const { id, name } = result;
      const newTownList = activatedTownList([...townList, { id, name, isActive: false }]);

      this.setState({ townList: newTownList });
    }).catch((errorMessage) => {
      this.setState({ errorMessage });
    }).finally(() => {
      this.setState({ isOpenModal: false });
    });
  }

  requestTownList (token) {
    request(TOWN_ENDPOINT, 'GET', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((result) => {
      const { towns } = result;
      this.setState({ townList: towns });
    }).catch((err) => {
      console.log(err);
    });
  }
}

const removeTown = (townList, townID) => {
  return townList.filter(town => {
    return town.id !== townID;
  });
};

const activatedTownList = townList => {
  if (!townList.length) return [];

  const isActive = townList.filter(town => town.isActive).length;

  if (!isActive) {
    townList[0].isActive = true;
  }

  return townList;
};

new App($root);
