import Component from '../../../core/component.js';

import _ from '../../../utils/dom.js';

import './style.scss';

export default class Carousel extends Component {
  getTemplate () {
    const { images } = this.props;
    return `
      <div class="carousel__container">
        ${
          images.map((image) => {
            return `
              <figure class="img-box gradient">
                <img src=${image}>
              </figure>
            `;
          }).join('')
        }
      </div>
    `;
  }

  setEventListener () {
    const $carousel = _.$('.carousel__container');
    let isClick = false;
    let initial = 0;
    let page = 0;

    $carousel.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isClick = true;
      initial = e.offsetX;
    });
    $carousel.addEventListener('mousemove', (e) => {
      if (isClick) {
        e.preventDefault();
        const currentScroll = $carousel.scrollLeft;
        const movement = (initial - e.offsetX) / 3;

        $carousel.scroll(currentScroll + movement, 0);
        page = Math.round((currentScroll + movement) / 320);
      }
    });
    document.addEventListener('mouseup', () => {
      if (isClick) {
        isClick = false;
        $carousel.scroll(page * 320, 0);
      }
    });
  }
}
