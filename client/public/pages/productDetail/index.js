import Component from '../../core/component.js';
import _ from '../../utils/dom.js';

import Header from '../../components/header.js';
import footer from './footer/index.js';
import Carousel from './carousel/index.js';

import parseProductStatus from '../../utils/parseProductStatus.js';
import parseCategoryType from '../../utils/parseCategoryType.js';
import timeFromNow from '../../utils/timeFromNow.js';

import './style.scss';

import { product } from '../../configs/mock.data.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {};
  }

  getTemplate () {
    const {
      status,
      name,
      category,
      timestamp,
      content,
      chatCount,
      likeCount,
      viewCount,
      seller,
      sellerTown,
      price,
      isLiked,
      isOwner
    } = product;

    return `
      <div id="product-detail__header"></div>
      <main>
        <div id="product-detail__carousel"></div>
        <div class="content-container">
          <div class="dropdown">
            ${parseProductStatus(status)}
            ${
              isOwner
              ? '<i class="wmi wmi-chevron-down"></i>'
              : ''
            }
          </div>
          <h3 class="name">${name}</h3>
          <div class="info">${parseCategoryType(category)}∙${timeFromNow(timestamp)}</div>
          <p class="content">${content}</p>
          <div class="info">
            채팅 ${chatCount}∙관심 ${likeCount}∙조회 ${viewCount}
          </div>
          <div class="seller-info-box">
            <div>판매자 정보</div>
            <div>
              ${seller}
              <span>${sellerTown}</span>
            </div>
          </div>
        </div>
      <div id="product-detail__main"></div>
      </main>
      ${footer({ price, isLiked, isOwner })}
    `;
  }

  mountChildren () {
    const { images } = product;

    const $header = _.$('#product-detail__header');
    const $carousel = _.$('#product-detail__carousel');

    new Header($header, { type: 'detail', title: '' });
    new Carousel($carousel, { images });
  }

  setEventListener () {

  }
}

new App($root);
