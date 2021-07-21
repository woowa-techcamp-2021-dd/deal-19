import Component from '../../../core/component.js';
import parsePrice from '../../../utils/parsePrice.js';
import './style.scss';

export default class EditorForm extends Component {
  getTemplate () {
    const { imageList, name, category, categoryList, price, content, location } = this.props;
    return `
      <div class="write__image-list content-box">
        <input class="input-area" id="input-image" type="file" accept="img/*"  multiple />
        <div class="image-box button-add-image">
          <div class="wmi-image"></div>
          <div>추가</div>
        </div>
        <div class="carousel">
          ${imageList
            .map(
              (src) =>
                `<div class="image-added image-box">
                  <figure>
                    <img src=${src} />
                  </figure>
                  <div class="wmi-close button-delete-image"></div>
                </div>`
            )
            .join('')}
        </div>
      </div>
      <div class="write__info content-box">
        <div>
        <input class="input-area" id="input-name" type="text" value="${name}" name="name" >
      </div>
      <div class="category">${
        category.id === '' ? '(필수) 카테고리를 선택해주세요.' : category.title
      }</div>
      <div class="carousel">
      ${categoryList
        .map(
          ({ title, id }) =>
            `<div class="category-item">
            <input class="input-area" type="radio" id="category-${id}" name="category" value="${title}" data-id="${id}">
            <label for="category-${id}">${title}</label>
          </div>`
        )
        .join('')}</div>
      </div>
      <div class="write__price content-box">
        <input id="input-price" class="input-area" type="text" name="price" value="${parsePrice(
        price
      )}" />
      </div>
      <div class="write__contents content-box">
        <textarea id="input-contents" name="content" class="input-area">${content}</textarea>
      </div>
        <div class="write__footer" >
      <div >${location}</div>
    </div>`;
  }

  mountChildren () {

  }

  setEventListener () {
    const { onChangeInput } = this.props;
    this.addEventListener('change', '.input-area', ({ target }) => {
      const { name, value } = target;
      if (name === 'price') {
        onChangeInput({ [name]: toNumber(value) });
        return;
      }
      if (name === 'category') {
        const id = target.dataset.id;
        onChangeInput({ [name]: { id, title: value } });
        return;
      }
      onChangeInput({ [name]: value });
    });
  }
}

const toNumber = (price) => {
  return Number(price.replace(/,/g, ''));
};
