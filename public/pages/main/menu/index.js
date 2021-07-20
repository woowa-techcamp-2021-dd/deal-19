import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import Header from '../../../components/header.js';
import TabBar from '../tabBar/index.js';
import List from '../../../components/list.js';

import { productList, sellProductList } from '../../../configs/mock.data.js';

import './style.scss';

export default class Menu extends Component {
  initState () {
    this.state = {
      tab: 'sell'
    };
  }

  getTemplate () {
    return `
      <div id="menu__header"></div>
      <div id="menu__tabbar"></div>
      <main class="menu__content"></main>
    `;
  }

  mountChildren () {
    const { tab } = this.state;
    const { closeSlider } = this.props;

    const $header = _.$('#menu__header');
    const $tabbar = _.$('#menu__tabbar');
    const $main = _.$('.menu__content');

    new Header($header, { title: '메뉴', closeSlider });
    new TabBar($tabbar, {
      current: tab,
      tabList: [
        {
          id: 'sell',
          label: '판매목록',
          action: this.changeTab('sell')
        },
        {
          id: 'chat',
          label: '채팅',
          action: this.changeTab('chat')
        },
        {
          id: 'like',
          label: '관심목록',
          action: this.changeTab('like')
        }
      ]
    });

    switch (tab) {
      case 'chat':
        // TODO: add chat list
        break;
      case 'like':
        new List($main, { productList });
        break;
      default:
        new List($main, { productList: sellProductList });
    }
  }

  setEventListener () {

  }

  // Custom Method
  changeTab (tab) {
    return () => this.setState({ tab });
  }
}
