import Component from '../core/component.js';
import _ from '../utils/dom.js';
import './header.scss';

export default class Header extends Component {
  getTemplate () {
    const { type, title } = this.props;

    return `
      <div class="header ${type}">
        <div class="header__left-box">${renderHeaderLeft(type)}</div>
        <div class="header__title">${title}</div>
        <div class="header__right-box">
          ${renderHeaderRight(type)}
        </div>
      </div>
      `;
  }

  setEventListener () {
    const { type, handlerClickRightIcon, hideSubPageBySlide } = this.props;

    const $left = _.$('.header__left-box');
    if (type && !['main', 'write', 'detail', 'chat'].includes(type)) {
      throw new Error('정확한 타입 지정 & 아예 쓰지 말 것');
    }

    if (type === 'main') {
      this.setMainHeaderHandler();
      return;
    }
    if (handlerClickRightIcon) {
      if (!['write', 'detail', 'chat'].includes(type)) {
        throw new Error('우측 아이콘 핸들러는 write, detail, chat 중 하나의 타입에서만 가능합니다.');
      }
      this.setRightIconHandler(handlerClickRightIcon);
    }

    $left.addEventListener('click', () => {
      if (hideSubPageBySlide) {
        hideSubPageBySlide();
        return;
      }
      moveToPrevPage();
    });
  }

  setMainHeaderHandler () {
    const { showLocation } = this;
    const { showSubPageBySlide } = this.props;

    _.$('.header__left-box').addEventListener('click', () => {
      showSubPageBySlide('category');
    });
    _.$('.header__title').addEventListener('click', showLocation);
    _.$('.header__my-account').addEventListener('click', () => {
      showSubPageBySlide('myAccount');
    });
    _.$('.header__menu').addEventListener('click', () => {
      showSubPageBySlide('myMenu');
    });
  }

  setRightIconHandler (handler) {
    const $rightIcon = _.$('.header__right-box > div');
    $rightIcon.addEventListener('click', handler);
  }

  showLocation () {
    console.log('동네 보여주기');
  }
}

const moveToPrevPage = () => {
  window.history.back();
};

const renderHeaderLeft = (type) => {
  if (type !== 'main') {
    return '<div class="wmi-chevron-left"></div>';
  }
  return '<div class="wmi-category"></div>';
};

const renderHeaderRight = (type) => {
  if (!type) return '';

  switch (type) {
    case 'main':
      return '<div class="wmi-user header__my-account"></div><div class="wmi-menu header__menu"></div>';
    case 'write':
      return '<div class="wmi-check"></div>';
    case 'detail':
      return '<div class="wmi-more-vertical"></div>';
    case 'chat':
      return '<div class="wmi-log-out"></div>';
    default :
      return '';
  }
};
