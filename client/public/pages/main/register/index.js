import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';
import MyPage from '../myPage/index.js';

import request from '../../../utils/fetchWrapper.js';

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
      town: '',
    };
  }

  getTemplate () {
    const {
      isIdValid,
      isTownValid,
      idErrorMessage,
      townErrorMessage,
      submitErrorMessage,
      id,
      town
    } = this.state;

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
            value="${id}"
          />
          ${
            idErrorMessage
            ? `<div class="error-message">${idErrorMessage}</div>`
            : ''
          }
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
          ${
            townErrorMessage
            ? `<div class="error-message">${townErrorMessage}</div>`
            : ''
          }
        </label>
        <div class="button-wrapper">
          <button
            class="btn large"
            id="submit"
            ${isIdValid &&  isTownValid? '' : 'disabled'}
          >회원가입</button>
          ${
            submitErrorMessage
            ? `<div class="error-message">${submitErrorMessage}</div>`
            : ''
          }
        </div>
      </div>
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
    this.addEventListener('click', '#submit', this.handleSubmit.bind(this));
  }

  didMount () {
    const { changeInnerContent } = this.props;

    const token = window.localStorage.getItem('accessToken');
    if (token) {
      changeInnerContent(MyPage)();
    }
  }

  // custon method
  handleIdFormat () {
    const id = _.$('#register-id').value;
    const town = _.$('#register-town').value;

    const ID_REGEX = /^(?=.*[a-zA-z])(?=.*[0-9]).{3,20}$/;
    
    if (!ID_REGEX.test(id)) {
      this.setState({
        idErrorMessage: '아이디의 형식이 올바르지 않습니다.',
        id,
        town,
        isIdValid: false
      });
      return false;
    }

    this.setState({ idErrorMessage: '', id, town, isIdValid: true });
    return true;
  }

  handleTownFormat () {
    const id = _.$('#register-id').value;
    const town = _.$('#register-town').value;

    const TOWN_REGEX = /^.{2,12}$/;

    if (!TOWN_REGEX.test(town)) {
      this.setState({
        townErrorMessage: '2글자 이상 12글자 이하를 맞춰주세요.',
        id,
        town,
        isTownValid: false
      });
      return false;
    }

    this.setState({ townErrorMessage: '', id, town, isTownValid: true });
    return true;
  }

  handleSubmit () {
    const { closeSlider } = this.props;

    const id = _.$('#register-id').value;
    const town = _.$('#register-town').value;

    const isIdValid = this.handleIdFormat();
    const isTownValid = this.handleTownFormat();

    if (!(isIdValid && isTownValid)) {
      return;
    }

    const $button = _.$('#submit');
    $button.setAttribute('disabled', true);

    console.log(id, town);

    request(SIGN_UP_ENDPOINT, 'POST', {
      body: JSON.stringify({ id, town }),
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
        this.setState({ submitErrorMessage: err, id, town });
      })
      .finally(() => {
        $button.removeAttribute('disabled');
      });
  }
};
