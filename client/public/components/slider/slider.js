import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import './slider.scss';

export default class Slider extends Component {
  initState () {
    const { sliderState, Constructor } = this.props;
    this.state = {
      sliderState,
      Constructor
    };
  }

  getTemplate () {
    const { sliderState } = this.state;

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

  setEventListener () {
    const $container = _.$('.slider__container');
    $container.addEventListener('animationend', () => {
      $container.classList.remove('open');
    });
  }

  // custom method
  changeInnerContent (Constructor) {
    return () => {
      const sliderState = _.$('.slider__container').classList[1];
      this.setState({ Constructor, sliderState });
    };
  }
}
