import Component from '../core/component.js';
import './header.scss';

export default class Header extends Component {
  getTemplate () {
    const { type, title } = this.props;

    return `
      <div class="header ${type}">
        <div class="header-left">${renderHeaderLeft(type)}</div>
        <div class="header-center">${title}</div>
        <div class="header-right">
          ${renderHeaderMenu(type)}
        </div>
      </div>
      `;
  }

  setEventListener () {

  }
}

const renderHeaderLeft = (type) => {
  if (type !== 'main') {
    return '<div class="wmi-chevron-left"></div>';
  }
  return '<div class="wmi-category"></div>';
};

const renderHeaderMenu = (type) => {
  if (!type) return '';

  switch (type) {
    case 'main':
      return '<div class="wmi-user"></div><div class="wmi-menu"></div>';
    case 'write':
      return '<div class="wmi-check"></div>';
    case 'detail':
      return '<div class="wmi-more-vertical"></div>';
    default :
      return '';
  }
};
