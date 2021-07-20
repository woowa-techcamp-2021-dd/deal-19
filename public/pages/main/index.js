import Component from '../../core/component.js';
import _ from '../../utils/dom.js';

import Header from '../../components/header.js';
import ProductList from '../../components/list.js';
import FAB from './fab/index.js';
import Slider from '../../components/slider.js';
import Login from './login/index.js';

import './style.scss';

import { productList } from '../../configs/mock.data.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      sliderState: 'open'
    };
  }

  getTemplate () {
    return `
      <div id="main__header"></div>
      <div id="main__list"></div>
    `;
  }

  mountChildren () {
    const { sliderState } = this.state;

    const $header = _.$('#main__header');
    const $list = _.$('#main__list');

    // new Header($header, { type: 'main', title: '방이동' });
    // new ProductList($list, { productList });
    // new FAB($list, { link: '' });
    new Slider($root, { sliderState, Constructor: Login, innerProps: { closeSlider: this.closeSlider() } });
  }

  setEventListener () {

  }

  closeSlider () {
    return () => {
      this.setState({ sliderState: 'close' });
    };
  }
}

new App($root);
