import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';

import './style.scss';

export default class Login extends Component {
  getTemplate () {
    return `
      <div id="login__header"></div>
      <div class="login__content">
        <div class="input-box">
          <input class="input large" />
          <div class="error-message">포맷을 맞춰주세요</div>
        </div>
        <button class="btn large">로그인</button>
        <button class="text-btn">회원가입</button>
      </div>
    `;
  }

  mountChildren () {
    const $header = _.$('#login__header');
    new Header($header, { title: '로그인' });
  }

  setEventListener () {

  }
}
