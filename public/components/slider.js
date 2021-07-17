import Component from '../core/component.js';
import _ from '../utils/dom.js';
import Header from './header.js';
import './slider.scss';

export default class Slider extends Component {
  initState () {
    this.state = {
      isOpen: false
    };
  }

  getTemplate () {
    const { sliderState } = this.props;

    return `
      <div class="slider__container ${sliderState}">
        <header class="slider__header"></header>
        <div class="slider__contents"></div>
      </div>
    `;
  }

  mountChildren () {
    const { Constructor, closeSlider, targetOfSlider, props } = this.props;

    const $header = _.$('.slider__header');
    const $container = _.$('.slider__contents');

    new Header($header, { title: '카테고리', hideSubPageBySlide: closeSlider });

    new Constructor($container, props);
  }

  setEventListener () {

  }
}
