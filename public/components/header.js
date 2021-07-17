import Component from '../core/component.js';
import _ from '../utils/dom.js';
import './header.scss';
import DropDown from '../components/dropdown.js';

export default class Header extends Component {
  getTemplate () {
    const { type, title } = this.props;
    return `
      <div class="header ${type}">
        <div class="${type} header__left-box">${renderHeaderLeft(type)}</div>
        <div class="${type} header__title">${title}</div>
        <div class="${type} header__right-box">
          ${renderHeaderRight(type)}
        </div>
      </div>
      `;
  }

  mountChildren () {
    const { type, title, buttonList } = this.props;

    if (type === 'main') {
      new DropDown(_.$('.header__title'), { buttonTemplate: `<div>${title}</div>`, position: 'center', buttonList });
    }

    if (type === 'detail') {
      new DropDown(_.$('.header__right-box'), { buttonTemplate: '<div>삼쩜</div>', position: 'right', buttonList });
    }
  }

  setEventListener () {
    const { type, handlerClickRightIcon, hideSubPageBySlide } = this.props;

    const $left = _.$(`.header__left-box.${type}`);
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
      console.log(1);
      if (hideSubPageBySlide) {
        hideSubPageBySlide();
        console.log('슬라이더 닫기');
        return;
      }
      moveToPrevPage();
    });
  }

  setMainHeaderHandler () {
    const { showLocation } = this;
    const { showSubPageBySlide, type } = this.props;

    _.$(`.header__left-box.${type}`).addEventListener('click', () => {
      showSubPageBySlide('category');
    });
    _.$(`.header__title.${type}`).addEventListener('click', showLocation);
    _.$(`.header__my-account.${type}`).addEventListener('click', () => {
      showSubPageBySlide('myAccount');
    });
    _.$(`.header__menu.${type}`).addEventListener('click', () => {
      showSubPageBySlide('myMenu');
    });
  }

  setRightIconHandler (handler) {
    const { type } = this.props;
    if (type === 'detail') return;
    const $rightIcon = _.$(`.header__right-box.${type} > div`);
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
      return `<div class="wmi-user header__my-account ${type}"></div><div class="wmi-menu header__menu ${type}"></div>`;
    case 'write':
      return '<div class="wmi-check"></div>';
    case 'chat':
      return '<div class="wmi-log-out"></div>';
    default :
      return '';
  }
};
