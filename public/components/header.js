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
    const { type, backToPrevPage } = this.props;

    const $left = _.$('.header__left-box');
    if (!['main', 'write', 'detail', 'chat'].includes(type)) {
      throw new Error('정확한 타입 지정 & 아예 쓰지 말 것');
    }

    if (type === 'main') {
      this.setMainHeaderHandler();
      return;
    }
    if (type) {
      this.setRightIconHandler(type);
    }

    $left.addEventListener('click', () => {
      if (backToPrevPage) {
        // history 직전 페이지가 아닌 다른 곳을 원할 때 or 클라이언트 사이드
        backToPrevPage();
        return;
      }
      // history에 남아있는 직전 페이지로 서버에 리다이렉트 요청
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
    const { type } = this.props;
    const $rightIcon = _.$('.header__right-box > div');
    $rightIcon.addEventListener('click', () => {
      switch (type) {
        case 'write':
          console.log('글 쓰기');
          break;
        case 'detail':
          console.log('수정/삭제 드롭박스 생성');
          // new DropDown($rightIcon, {});
          break;
        case 'chat':
          console.log('나가기 확인 모달 생성');
          // new Modal($rightIcon, {})
          break;
        default:
          return new Error('잘못된 타입');
      }
    });
  }

  showLocation () {
    console.log('동네 보여주기');
  }
}

const moveToPrevPage = () => {
  console.log('직전 페이지로');
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
