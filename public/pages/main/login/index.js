import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';
import Register from '../register/index.js';

import request from '../../../utils/fetchWrapper.js';

import { SIGN_IN_ENDPOINT } from '../../../configs/endpoints.js';

import './style.scss';

export default class Login extends Component {
  initState () {
    this.state = {
      errorMessage: '',
      id: ''
    };
  }

  getTemplate () {
    const { errorMessage } = this.state;

    return `
      <div id="login__header"></div>
      <div class="login__content">
        <div class="input-box">
          <input class="input large" id="id-input" value="${this.state.id}" />
          ${
            errorMessage
            ? `<div class="error-message">${errorMessage}</div>`
            : ''
          }
        </div>
        <button class="btn large" id="submit">로그인</button>
        <button class="text-btn" id="register">회원가입</button>
      </div>
    `;
  }

  mountChildren () {
    const { closeSlider } = this.props;

    const $header = _.$('#login__header');
    new Header($header, { title: '로그인', closeSlider });
  }

  setEventListener () {
    const { changeInnerContent } = this.props;

    this.addEventListener('click', '#submit', this.handleSubmit.bind(this));
    this.addEventListener('click', '#register', changeInnerContent.bind(this, Register));
  }

  // custom method
  handleSubmit () {
    const { closeSlider } = this.props;

    const id = _.$('#id-input').value;

    const regex = /^(?=.*[a-zA-z])(?=.*[0-9]).{3,20}$/;

    if (!regex.test(id)) {
      this.setState({ errorMessage: '아이디의 형식이 올바르지 않습니다.', id });
      return;
    }

    const $button = _.$('#submit');
    $button.setAttribute('disabled', true);

    request(SIGN_IN_ENDPOINT, 'POST', {
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) => {
        const { accessToken } = result;
        window.localStorage.setItem('accessToken', accessToken);
        closeSlider();
      })
      .catch((err) => {
        this.setState({ errorMessage: err, id });
      })
      .finally(() => {
        $button.removeAttribute('disabled');
      });
  }
}
