import Component from '../../core/component.js';

import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';

import Header from '../../components/header/header.js';
import ProductList from '../../components/list/list.js';
import Slider from '../../components/slider/slider.js';
import Category from './category/index.js';
import MyPage from './myPage/index.js';
import Menu from './menu/index.js';

import { PRODUCTS_ENDPOINT, TOWN_ENDPOINT } from '../../configs/endpoints.js';

import tungImage from '../../assets/image/tung.jpeg';
import './style.scss';

const SLIDER_CONTENTS = {
  category: { Constructor: Category, title: '카테고리' },
  myPage: { Constructor: MyPage, title: '내 계정' },
  menu: { Constructor: Menu, title: '메뉴' }
};

export default class Main extends Component {
  initState () {
    this.state = {
      current: '',
      sliderState: 'none',
      targetOfSlider: '',
      productList: [],
      town: '',
      towns: []
    };
  }

  getTemplate () {
    const { productList } = this.state;

    return `
      <header id="main__header"></header>
      <main id="main__list">
        ${productList.length === 0
          ? `
            <div id="main__tung">
              <img src="${tungImage}"/>
              <p>이 동네에는 아무도 없서요</p>
            </div>`
          : ''
        }
      </main>
      <div id="main__slider"></div>
      <a href="/editor">
        <button class="fab__container">
          <i class="wmi wmi-add"></i>
        </button>
      </a>
    `;
  }

  didInitialMount () {
    const token = window.localStorage.getItem('_at');

    requestTowns.call(this, token);
    requestProductList.call(this, token);
  }

  mountChildren () {
    const { openSlider, closeSlider } = this;
    const { sliderState, targetOfSlider, productList, town, towns } = this.state;
    const { signOut, userID } = this.props;

    const $header = _.$('#main__header');
    const $list = _.$('#main__list');
    const $slider = _.$('#main__slider');

    new Header($header, {
      type: 'main',
      title: town,
      buttonList: this.createDropdownContents(towns),
      openSlider: openSlider.bind(this)
    });

    if (productList.length > 0) {
      new ProductList($list, { productList });
    }

    if (sliderState === 'open' || sliderState === 'close') {
      const { Constructor, title } = SLIDER_CONTENTS[targetOfSlider];

      const innerProps = {
        closeSlider: closeSlider.bind(this),
        title,
        signOut,
        userID
      };

      if (targetOfSlider === 'category') {
        innerProps.action = (category) => {
          const token = window.localStorage.getItem('_at');

          request(`${PRODUCTS_ENDPOINT}?type=town&category=${category}`, 'GET', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then((result) => {
              const { productList } = result;
              this.setState({ productList }, true);
            });
        };
      }

      new Slider($slider, {
        sliderState,
        Constructor,
        innerProps
      });
    }
  }

  setEventListener () {
    this.addEventListener('animationend', '#main__slider', () => {
      const { sliderState } = this.state;
      if (sliderState === 'close') {
        this.removeSlider();
      }
    });
  }

  // custom method
  openSlider (target) {
    this.setState({ sliderState: 'open', targetOfSlider: target });
  }

  closeSlider () {
    this.setState({ sliderState: 'close' });
  }

  removeSlider () {
    this.setState({ sliderState: 'none' });
  }

  createDropdownContents (towns) {
    const token = window.localStorage.getItem('_at');

    const dropdownContents = towns.map(({ id, name }) => {
      const label = name;
      const action = () => {
        request(`${PRODUCTS_ENDPOINT}?type=town&town=${id}`, 'GET', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then((result) => {
            const { productList } = result;
            this.setState({ productList, town: label });
          });
      };

      return { label, action };
    });
    dropdownContents.push({
      label: '내 동네 설정하기',
      action: () => {
        window.location.assign('/location');
      }
    });

    return dropdownContents;
  };
}

function requestTowns (token) {
  request(TOWN_ENDPOINT, 'GET', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((result) => {
      const { towns } = result;
      const town = towns.filter(({ isActive }) => isActive)[0].name;
      this.setState({ towns, town });
    });
}

function requestProductList (token) {
  request(`${PRODUCTS_ENDPOINT}?type=town`, 'GET', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((result) => {
      const { productList } = result;
      this.setState({ productList });
    });
}
