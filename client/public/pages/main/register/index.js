import Component from '../../../core/component.js';

import _ from '../../../utils/dom.js';
import request from '../../../utils/fetchWrapper.js';
import checkRegex from '../../../utils/checkRegex.js';

import Header from '../../../components/header/header.js';

import { SIGN_UP_ENDPOINT } from '../../../configs/endpoints.js';

import './style.scss';

export default class Register extends Component {
  initState () {
    this.state = {
      isIdValid: false,
      isTownValid: false,
      idErrorMessage: '',
      townErrorMessage: '',
      submitErrorMessage: '',
      id: '',
      town: ''
    };
  }

  getTemplate () {
    const {
      submitErrorMessage,
      id,
      town
    } = this.state;

    return `
      <div id="register__header"></div>
      <form class="register__content" id="signup-submit" name="signup">
        <label>아이디
          <input
            id="register-id"
            class="input large"
            placeholder="영문, 숫자 조합 20자 이하"
            type="text"
            maxlength="20"
            value="${id}"
          />
        </label>
        <label>우리 동네
          <input
            id="register-town"
            class="input large"
            placeholder="시∙구 제외, 동만 입력"
            type="text
            maxlength="12"
            value="${town}"
          />
        </label>
        <div class="button-wrapper">
          <button
            class="btn large"
            type="submit"
          >회원가입</button>
          ${
            submitErrorMessage
            ? `<div class="error-message">${submitErrorMessage}</div>`
            : ''
          }
        </div>
      </form>
    `;
  }

  mountChildren () {
    const { closeSlider } = this.props;

    const $header = _.$('#register__header');
    new Header($header, { title: '회원가입', closeSlider });
  }

  setEventListener () {
    this.addEventListener('focusout', '#register-id', this.handleIdFormat.bind(this));
    this.addEventListener('focusout', '#register-town', this.handleTownFormat.bind(this));
    this.addEventListener('submit', '#signup-submit', this.handleSubmit.bind(this));
  }

  // custon method
  handleIdFormat () {
    const form = document.forms.signup;

    const id = form.elements['register-id'].value;
    const isIDFormatValid = checkRegex('ID', id);

    if (!isIDFormatValid) {
      displayErrorMessage('#register-id', '아이디의 형식이 올바르지 않습니다.');
      return false;
    }

    removeErrorMessage('#register-id');
    return true;
  }

  handleTownFormat () {
    const form = document.forms.signup;

    const town = form.elements['register-town'].value;
    const isTownFormatValid = checkRegex('TOWN', town);

    if (!isTownFormatValid) {
      displayErrorMessage('#register-town', '2글자 이상 12글자 이하를 맞춰주세요.');
      return false;
    }

    removeErrorMessage('#register-town');
    return true;
  }

  handleSubmit (e) {
    e.preventDefault();

    const form = document.forms.signup;

    const id = form.elements['register-id'].value;
    const town = form.elements['register-town'].value;

    const isIdValid = this.handleIdFormat();
    const isTownValid = this.handleTownFormat();

    if (!(isIdValid && isTownValid)) {
      return;
    }

    const $button = _.$('#signup-submit');
    $button.setAttribute('disabled', true);

    requestSignUpSubmit.call(this, id, town);
  }
};

function requestSignUpSubmit (id, town) {
  const { signIn } = this.props;

  const $button = _.$('#signup-submit');

  request(SIGN_UP_ENDPOINT, 'POST', {
    body: JSON.stringify({ id, town }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      const { accessToken, id } = result;
      window.localStorage.setItem('_at', accessToken);
      signIn(id);
    })
    .catch((err) => {
      this.setState({ submitErrorMessage: err, id, town });
    })
    .finally(() => {
      $button.removeAttribute('disabled');
    });
};

function displayErrorMessage (targetSelector, message) {
  const $target = _.$(targetSelector).parentNode;

  const $errorMessage = $target.querySelector('.error-message');

  if ($errorMessage) {
    $errorMessage.innerText = message;
  } else {
    $target.insertAdjacentHTML('beforeend', `
      <div class="error-message">${message}</div>
    `);
  }
}

function removeErrorMessage (targetSelector) {
  const $target = _.$(targetSelector).parentNode;

  const $errorMessage = $target.querySelector('.error-message');
  if ($errorMessage) {
    $errorMessage.remove();
  }
}
