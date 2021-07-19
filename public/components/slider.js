import Component from '../core/component.js';
import _ from '../utils/dom.js';
import './slider.scss';

export default class Slider extends Component {
  getTemplate () {
    const { sliderState } = this.props;

    return `
      <div class="slider__container ${sliderState}">
      </div>
    `;
  }

  mountChildren () {
    const { Constructor, innerProps } = this.props;

    const $container = _.$('.slider__container');
    new Constructor($container, innerProps);
  }
}
