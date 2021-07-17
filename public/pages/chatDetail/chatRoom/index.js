import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import './style.scss';

export default class ChatRoom extends Component {
  initState () {
    this.state = {
      product: {
        name: '빈티지 롤러 스케이트',
        price: 160000,
        thumbnail: 'https://i.guim.co.uk/img/media/8a13052d4db7dcd508af948e5db7b04598e03190/0_294_5616_3370/master/5616.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bcaa4eed2c1e6dab61c41a61e41433d9',
        saleState: 'sale'
      },
      log: [
        { type: 'receive', say: '안녕하세요! 궁금한게 있는데요' },
        { type: 'send', say: '네! 안녕하세요!' },
        { type: 'receive', say: '혹시' },
        { type: 'receive', say: '실제로 신어볼 수 있는건가요?' },
        { type: 'send', say: '발 크기가 어떻게 되세요?' },
        { type: 'receive', say: '270정도 되는데' },
        { type: 'receive', say: '발볼이 좀 커요' },
        { type: 'receive', say: '괜찮을까요?' },
        { type: 'send', say: '저도 그정도 되는데 괜찮을거 같습니다' },
        { type: 'send', say: '직거래 하면서 신어보세요' },
        { type: 'receive', say: '그럼 방이동에서 만나요' },
        { type: 'send', say: '좋습니다.' }

      ]
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
