import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import request from '../../utils/fetchWrapper.js';

import Header from '../../components/header.js';
import footer from './footer/index.js';
import Carousel from './carousel/index.js';

import parseProductStatus from '../../utils/parseProductStatus.js';
import parseCategoryType from '../../utils/parseCategoryType.js';
import timeFromNow from '../../utils/timeFromNow.js';

import { AUTH_ENDPOINT, ITEMS_ENDPOINT } from '../../configs/endpoints.js';

import './style.scss';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      images: [],
      status: 'sold',
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

    const token = window.localStorage.getItem('accessToken');

    fetch(AUTH_ENDPOINT, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          window.location.assign('/');
        }

        const pid = window.location.pathname.split('productDetil/')[1];
        const API_ENDPOINT = `${ITEMS_ENDPOINT}/${pid}`;

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
              status,
              town,
              likeCount,
              isLiked,
              seller,
              isOwner
            } = result;

            this.setState({
              images,
              status,
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
      });
  }

  getTemplate () {
    const {
      status,
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
          <div class="dropdown">
            ${parseProductStatus(status)}
            ${
              isOwner
              ? '<i class="wmi wmi-chevron-down"></i>'
              : ''
            }
          </div>
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

    new Header($header, { type: 'detail', title: '', buttonList: [] });
    new Carousel($carousel, { images });
  }

  setEventListener () {

  }
}

new App($root);
