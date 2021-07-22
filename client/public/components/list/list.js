import Component from '../../core/component.js';

import parsePrice from '../../utils/parsePrice.js';
import timeFromNow from '../../utils/timeFromNow.js';

import './list.scss';

export default class ProductList extends Component {
  getTemplate () {
    const { productList } = this.props;

    return `
      <div class="product-list">
        ${
          productList.map((productItem) => {
            const {
              id,
              isLiked,
              name,
              thumbnail,
              timeCreated,
              price,
              likeCount,
              isOwner,
              town
            } = productItem;

            const time = timeFromNow(new Date(timeCreated).getTime());

            return `
              <div class="product-item" id="${id}">
                <img class="thumbnail" src="${thumbnail || 'http://www-cdr.stanford.edu/~petrie/blank.gif'}" />
                <div class="product-info">
                  <h4>${name}</h4>
                  <div class="location">${town} · ${time}</div>
                  <div class="price">${parsePrice(price)}원</div>
                </div>
                <button class="top-right-button">
                ${
                  isOwner
                  ? `
                    <i class="wmi wmi-more-vertical"></i>
                  `
                  : `
                    <i class="wmi wmi-heart ${isLiked ? 'full' : ''}"></i>
                  `
                }
                </button>
                <div class="count-wrapper">
                ${
                  likeCount > 0
                    ? `
                    <div class="count-box">
                      <i class="wmi wmi-heart"></i>
                      <div class="count-number">${likeCount}</div>
                    </div>
                  `
                  : ''
                }
                </div>
              </div>
            `;
          }).join('')
        }
      </div>
    `;
  }

  setEventListener () {
    this.addEventListener('click', '.product-item', (e) => {
      const $button = e.target.closest('.top-right-button');

      if ($button) {
        console.log('like');
        return;
      }

      const $item = e.target.closest('.product-item');
      const pid = $item.id;
      console.log(`/productDetail/${pid}`);
      window.location.assign(`/productDetail/${pid}`);
    });
  }
}
