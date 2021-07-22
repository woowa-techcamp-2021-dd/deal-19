import Component from '../../core/component.js';

import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';
import checkTokenValidity from '../../utils/checkTokenValidity.js';

import Header from '../../components/header/header.js';
import footer from './footer/index.js';
import Carousel from './carousel/index.js';

import parseCategoryType from '../../utils/parseCategoryType.js';
import timeFromNow from '../../utils/timeFromNow.js';

import { PRODUCTS_ENDPOINT } from '../../configs/endpoints.js';

import './style.scss';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      images: [],
      name: '',
      category: 'etc',
      timestamp: '',
      content: '',
      likeCount: 0,
      viewCount: 0,
      seller: '',
      sellerTown: '',
      price: 0,
      isLiked: false,
      isOwner: false
    };
  }

  getTemplate () {
    const {
      name,
      category,
      timeCreated,
      content,
      likeCount,
      seller,
      town,
      price,
      isLiked,
      isOwner
    } = this.state;

    return `
      <div id="product-detail__header"></div>
      <main>
        <div id="product-detail__carousel"></div>
        <div class="content-container">
          <h3 class="name">${name}</h3>
          <div class="info">
            ${parseCategoryType(category)}
            ∙
            ${timeFromNow(new Date(timeCreated).getTime())}
          </div>
          <p class="content">${content}</p>
          <div class="info">
            관심 ${likeCount}
          </div>
          <div class="seller-info-box">
            <div>판매자 정보</div>
            <div>
              ${seller}
              <span>${town}</span>
            </div>
          </div>
        </div>
      <div id="product-detail__main"></div>
      </main>
      ${footer({ price, isLiked, isOwner })}
    `;
  }

  mountChildren () {
    const { images } = this.state;

    const $header = _.$('#product-detail__header');
    const $carousel = _.$('#product-detail__carousel');

    new Header($header, { type: 'detail', title: '', buttonList: [{ label: '수정하기', action: () => {} }, { label: '삭제하기', action: () => {} }] });
    new Carousel($carousel, { images });
  }

  setEventListener () {

  }

  didInitialMount () {
    checkTokenValidity((success) => {
      if (success) {
        const token = window.localStorage.getItem('_at');
        this.requestProduct(token);
      } else {
        window.localStorage.removeItem('_at');
        window.location.replace('/');
      }
    });
  }

  // Custom Methods
  requestProduct (token) {
    const pid = window.location.pathname.split('productDetail/')[1];
    const API_ENDPOINT = `${PRODUCTS_ENDPOINT}/${pid}`;

    request(API_ENDPOINT, 'GET', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((result) => {
        const {
          images,
          name,
          timeCreated,
          price,
          category,
          content,
          town,
          likeCount,
          isLiked,
          seller,
          isOwner
        } = result;

        this.setState({
          images,
          name,
          category,
          timeCreated,
          content,
          likeCount,
          seller,
          town,
          price,
          isLiked,
          isOwner
        }, true);
      });
  }
}

new App($root);
