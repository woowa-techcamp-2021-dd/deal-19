import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import DropDown from '../dropdown/dropdown.js';
import './header.scss';

export default class Header extends Component {
  getTemplate () {
    const { type = 'normal', title } = this.props;

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
    const { type = 'normal', title, buttonList } = this.props;

    if (type === 'main') {
      new DropDown(_.$('.header__title'), { buttonTemplate: `<div><i class="wmi wmi-map-pin"></i> ${title}</div>`, position: 'center', buttonList });
    }

    if (type === 'detail') {
      new DropDown(_.$('.header__right-box'), { buttonTemplate: '<div><i class="wmi wmi-more-vertical"></i></div>', position: 'right', buttonList });
    }
  }

  setEventListener () {
    const { type = 'normal', handlerClickRightIcon, closeSlider } = this.props;
    const $left = _.$(`.header__left-box.${type}`);

    if (type === 'main') {
      this.setMainHeaderHandler();
      return;
    }
    if (handlerClickRightIcon) {
      if (!['write', 'detail'].includes(type)) {
        throw new Error('우측 아이콘 핸들러는 write, detail 중 하나의 타입에서만 등록 가능합니다.');
      }
      this.setRightIconHandler(handlerClickRightIcon);
    }

    $left.addEventListener('click', () => {
      if (closeSlider) {
        closeSlider();
        return;
      }
      moveToPrevPage();
    });
  }

  setMainHeaderHandler () {
    const { openSlider, type } = this.props;
    _.$(`.header__left-box.${type}`).addEventListener('click', () => {
      openSlider('category');
    });

    _.$(`.header__my-account.${type}`).addEventListener('click', () => {
      openSlider('myPage');
    });

    _.$(`.header__menu.${type}`).addEventListener('click', () => {
      openSlider('menu');
    });
  }

  setRightIconHandler (handler) {
    const { type } = this.props;
    const $rightIcon = _.$(`.header__right-box.${type}`);
    $rightIcon.addEventListener('click', handler);
  }
}

const moveToPrevPage = () => {
  window.history.back();
};

const renderHeaderLeft = (type) => {
  if (type !== 'main') {
    return '<div class="wmi wmi-chevron-left"></div>';
  }
  return '<div class="wmi wmi-category"></div>';
};

const renderHeaderRight = (type) => {
  if (!type) return '';

  switch (type) {
    case 'main':
      return `<div class="wmi wmi-user header__my-account ${type}"></div><div class="wmi wmi-menu header__menu ${type}"></div>`;
    case 'write':
      return '<button form="editor__form"><div class="wmi wmi-check"></div></button>';
    default :
      return '';
  }
};
