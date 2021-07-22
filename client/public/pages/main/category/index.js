import Component from '../../../core/component.js';

import _ from '../../../utils/dom.js';

import Header from '../../../components/header/header.js';

import { categoryList } from '../../../configs/constants.js';

import './style.scss';

export default class Category extends Component {
  getTemplate () {
    return `
      <header id="category__header"></header>
      <div class="category__content">
        ${
          categoryList.map((category) => {
            const { title, id, src } = category;
            return (`
              <button class="category__item" data-category="${id}">
                <figure class="img-box small">
                  <img src="${src}">
                </figure>
                <div class="title">${title}</div>
              </button>
            `);
          }).join('')
        }
      </div>
    `;
  }

  mountChildren () {
    const { closeSlider } = this.props;
    const $header = _.$('#category__header');
    new Header($header, { title: '카테고리', closeSlider });
  }

  setEventListener () {
    const { action, closeSlider } = this.props;

    this.addEventListener('click', '.category__content', (e) => {
      const $categoryItem = e.target.closest('.category__item');
      if ($categoryItem) {
        const category = $categoryItem.dataset.category;
        action(category);
        closeSlider();
      }
    });
  }
}
