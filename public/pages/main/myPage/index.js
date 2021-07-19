import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';

import './style.scss';

export default class MyPage extends Component {
  initState () {
    this.state = {
      uid: '우아한'
    };
  }

  getTemplate () {
    const { uid } = this.state;
    return `
      <div id="my-page__header"></div>
      <div class="my-page__content">
        <div class="display">${uid}</div>
        <button class="btn large">로그아웃</button>
      </div>
    `;
  }

  mountChildren () {
    const { closeSlider } = this.props;

    const $header = _.$('#my-page__header');
    new Header($header, { title: '내 계정', closeSlider });
  }

  setEventListener () {

  }
}
