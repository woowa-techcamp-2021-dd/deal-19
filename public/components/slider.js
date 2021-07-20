import Component from '../core/component.js';
import _ from '../utils/dom.js';
import './slider.scss';

export default class Slider extends Component {
  initState () {
    const { Constructor } = this.props;
    this.state = {
      Constructor
    };
  }

  getTemplate () {
    const { sliderState } = this.props;

    return `
      <div class="slider__container ${sliderState}">
      </div>
    `;
  }

  mountChildren () {
    const { Constructor } = this.state;
    const { innerProps } = this.props;

    innerProps.changeInnerContent = this.changeInnerContent.bind(this);

    const $container = _.$('.slider__container');
    new Constructor($container, innerProps);
  }

  // custom
  changeInnerContent (Constructor) {
    return () => {
      this.setState({ Constructor });
    };
  }
}
