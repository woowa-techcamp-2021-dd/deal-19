import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import './style.scss';
import { PRODUCT, LOG } from '../../../configs/mock.data.js';
export default class ChatRoom extends Component {
  initState () {
    this.state = {
      product: PRODUCT,
      log: LOG
    };
  }

  getTemplate () {
    const { product, log } = this.state;
    const { name, price, thumbnail, saleState } = product;

    return `
    <div id="chat-contents__container">
      <div id="chat-contents__product-info">
        <figure>
          <img src="${thumbnail}"/>
        </figure>
        <div class="product-text-info">
          <h3>${name}</h3>
          <div>${price}</div>
        </div>
        <div class="product-state">${saleState === 'sale' ? '판매중' : '판매완료'}</div>
      </div>
      <ul id="chat-contents__chatroom">
        ${log.map(({ type, say }) => `
          <li class="${type}">
            <div>${say}</div>
          </li>
        `).join('')}
      </ul>
      <div id="chat-contents__input-box">
        <input type="text" placeholder="메세지를 입력하세요."/>
        <div class="wmi-send"></div>
      </div>
    </div>
    `;
  }

  mountChildren () {
    const $productInfo = _.$('#chat-contents__product_info');
    const $chatroom = _.$('#chat-contents__chatroom');
  }

  setEventListener () {}
}
