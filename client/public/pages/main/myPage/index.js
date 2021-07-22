import Component from '../../../core/component.js';

import _ from '../../../utils/dom.js';

import Header from '../../../components/header/header.js';

import './style.scss';

export default class MyPage extends Component {
  getTemplate () {
    const { userID } = this.props;
    return `
      <div id="my-page__header"></div>
      <div class="my-page__content">
        <div class="display">${userID}</div>
        <button class="btn large" id="logout">로그아웃</button>
      </div>
    `;
  }

  mountChildren () {
    const { closeSlider } = this.props;

    const $header = _.$('#my-page__header');
    new Header($header, { title: '내 계정', closeSlider });
  }

  setEventListener () {
    const { signOut } = this.props;
    this.addEventListener('click', '#logout', signOut);
  }
}
