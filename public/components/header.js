import Component from '../core/component.js';
// import _ from '../utils/dom.js';
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
      </div>`;
  }

  setEventListener () {

  }
}

const renderHeaderLeft = (type) => {
  if (type !== 'main') {
    return '<div>뒤</div>';
  }
  return '<div>네모</div>';
};

const renderHeaderMenu = (type) => {
  if (!type) return '';

  switch (type) {
  case 'main':
    return '<div>사람</div><div>햄</div>';
  case 'write':
    return '<div>쳌</div>';
  case 'detail':
    return '<div>...</div>';
  default :
    return '';
  }
};
