import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';

import './style.scss';

export default class Register extends Component {
  initState () {
    this.state = {
      isValid: false
    };
  }

  getTemplate () {
    const { isValid } = this.state;

    return `
      <div id="register__header"></div>
      <div class="register__content">
        <label>아이디
          <input
            id="register-id"
            class="input large"
            placeholder="영문, 숫자 조합 20자 이하"
            type="text"
            maxlength="20"
          />
          <div class="error-message">포맷을 맞춰주세요</div>
        </label>
        <label>우리 동네
          <input
            id="register-town"
            class="input large"
            placeholder="시∙구 제외, 동만 입력"
            type="text
            maxlength="12"
          />
          <div class="error-message">포맷을 맞춰주세요</div>
        </label>
        <button class="btn large" ${isValid ? '' : 'disabled'}>회원가입</button>
        <div class="error-message">포맷을 맞춰주세요</div>
      </div>
    `;
  }

  mountChildren () {
    const $header = _.$('#register__header');
    new Header($header, { title: '회원가입' });
  }

  setEventListener () {

  }
}
