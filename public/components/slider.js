import Component from '../core/component.js';
import _ from '../utils/dom.js';
import Header from './header.js';
import './slider.scss';

export default class Slider extends Component {
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
    const { closeSlider, Constructor, title } = this.props;

    const $header = _.$('.slider__header');
    const $container = _.$('.slider__contents');

    new Header($header, { title, closeSlider });

    new Constructor($container, {});
  }

  setEventListener () {

  }
}
