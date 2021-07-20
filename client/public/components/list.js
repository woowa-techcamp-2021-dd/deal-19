import Component from '../core/component.js';

import './list.scss';

export default class ProductList extends Component {
  getTemplate () {
    const { productList } = this.props;

    return `
      <div class="product-list">
        ${
          productList.map((productItem) => {
            const {
              thumbnail,
              title,
              location,
              timestamp,
              price,
              chatCount,
              likeCount,
              isOwner
            } = productItem;

            const time = new Date(timestamp).toLocaleDateString();

            return `
              <div class="product-item" data-link="${price}">
                <img class="thumbnail" src="${thumbnail || 'http://www-cdr.stanford.edu/~petrie/blank.gif'}" />
                <div class="product-info">
                  <h4>${title}</h4>
                  <div class="location">${location} · ${time}</div>
                  <div class="price">${price}원</div>
                </div>
                <button class="top-right-button">
                ${
                  isOwner
                  ? `
                    <i class="wmi wmi-more-vertical"></i>
                  `
                  : `
                    <i class="wmi wmi-heart"></i>
                  `
                }
                </button>
                <div class="count-wrapper">
                ${
                  chatCount > 0
                    ? `
                    <div class="count-box">
                      <i class="wmi wmi-message-square"></i>
                      ${chatCount}
                    </div>
                  `
                  : ''
                }
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
      console.log(e.target.closest('.product-item'));
    });

    this.addEventListener('click', '.top-right-button', (e) => {
      console.log(e.target.closest('.top-right-button'));
    });
  }
}
