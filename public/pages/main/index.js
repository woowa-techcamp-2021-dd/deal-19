import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import Header from '../../components/header.js';
import ProductList from '../../components/list.js';
import FAB from './fab/index.js';

import './style.scss';
import { productList } from '../../configs/mock.data.js';
import Slider from '../../components/slider.js';
import Category from './category/index.js';
import MyPage from './myPage/index.js';
import Menu from './menu/index.js';

const $root = document.querySelector('#root');
const SLIDER_CONTENTS = {
  category: { Constructor: Category, title: '카테고리' },
  myPage: { Constructor: MyPage, title: '내 계정' },
  menu: { Constructor: Menu, title: '메뉴' }
};

class App extends Component {
  initState () {
    this.state = {
      current: '',
      sliderState: 'none',
      targetOfSlider: ''
    };
  }

  getTemplate () {
    return `
      <div id="main__header"></div>
      <div id="main__list"></div>
      <div id="main__slider"></div>   
    `;
  }

  mountChildren () {
    const { openSlider, closeSlider } = this;
    const { sliderState, targetOfSlider } = this.state;

    const $header = _.$('#main__header');
    const $list = _.$('#main__list');
    const $slider = _.$('#main__slider');

    new Header($header, {
      type: 'main',
      title: '방이동',
      buttonList: [
        {
          label: '방이동',
          action: () => {
            console.log('방이동');
          }
        },
        {
          label: '석촌동',
          action: () => {
            console.log('석촌동');
          }
        },
        {
          label: '내 동네 설정하기',
          action: () => {
            console.log('내 동네 설정');
          }
        }
      ],
      openSlider: openSlider.bind(this)
    });
    new ProductList($list, { productList });
    new FAB($list, { link: '' });

    if (sliderState === 'open' || sliderState === 'close') {
      const { Constructor, title } = SLIDER_CONTENTS[targetOfSlider];

      new Slider($slider, {
        sliderState,
        Constructor,
        innerProps: {
          closeSlider: closeSlider.bind(this),
          title
        }
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

  openSlider (target) {
    this.setState({ sliderState: 'open', targetOfSlider: target });
  }

  closeSlider () {
    this.setState({ sliderState: 'close' });
  }

  removeSlider () {
    this.setState({ sliderState: 'none' });
  }

  closeSlider () {
    return () => {
      this.setState({ sliderState: 'close' });
    };
  }
}

new App($root);
