import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import request from '../../../utils/fetchWrapper.js';

import Header from '../../../components/header/header.js';
import TabBar from '../tabBar/index.js';
import List from '../../../components/list/list.js';

import { PRODUCTS_ENDPOINT } from '../../../configs/endpoints.js';
import { SELL_TAB, LIKE_TAB } from '../../../configs/constants.js';

import './style.scss';

export default class Menu extends Component {
  initState () {
    this.state = {
      tab: SELL_TAB,
      productList: []
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
    const { tab, productList } = this.state;
    const { closeSlider } = this.props;

    const $header = _.$('#menu__header');
    const $tabbar = _.$('#menu__tabbar');
    const $main = _.$('.menu__content');

    new Header($header, { title: '메뉴', closeSlider });
    new TabBar($tabbar, {
      current: tab,
      tabList: [
        {
          id: SELL_TAB,
          label: '판매목록',
          action: this.changeTab.bind(this, SELL_TAB)
        },
        {
          id: LIKE_TAB,
          label: '관심목록',
          action: this.changeTab.bind(this, LIKE_TAB)
        }
      ]
    });

    new List($main, { productList });
  }

  didInitialMount () {
    const token = window.localStorage.getItem('_at');

    requestProductList.call(this, token, 'sale');
  }

  // Custom Method
  changeTab (tab) {
    this.setState({ tab });

    const token = window.localStorage.getItem('_at');
    const type = tab === SELL_TAB ? 'sale' : 'liked';

    requestProductList.call(this, token, type);
  }
}

function requestProductList (token, type) {
  request(`${PRODUCTS_ENDPOINT}?type=${type}`, 'GET', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((result) => {
      const { productList } = result;
      this.setState({ productList });
    });
}
