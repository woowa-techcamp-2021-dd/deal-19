import parsePrice from '../../../utils/parsePrice.js';

function Footer (props) {
  const { price, isLiked, isOwner } = props;

  const template = `
    <footer>
      ${
        isLiked
        ? '<i class="wmi wmi-heart"></i>'
        : '<i class="wmi wmi-heart"></i>'
      }
      <div class="divider"></div>
      <div class="price">${parsePrice(price)}원</div>
      <a>
        <button class="btn medium ${isOwner ? 'light-color' : ''}">
        ${isOwner ? '채팅 목록 보기' : '문의하기'}
        </button>
      </a>
    </footer>
  `;

  return template;
}

export default Footer;
