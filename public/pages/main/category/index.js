import Component from '../../../core/component.js';

import { categoryList } from '../../../configs/constants.js';

import './style.scss';

export default class Category extends Component {
  getTemplate () {
    return `
      <div class="category__content">
        ${
          categoryList.map((category) => {
            const { title, id } = category;
            return (`
              <button class="category__item" id="category-${id}">
                <figure class="img-box small">
                  <img src="">
                </figure>
                <div class="title">${title}</div>
              </button>
            `);
          }).join('')
        }
      </div>
    `;
  }

  setEventListener () {
    this.addEventListener('click', '.category__content', (e) => {
      const $categoryItem = e.target.closest('.category__item');
      if ($categoryItem) {
        const id = $categoryItem.id;
        console.log(id);
      }
    });
  }
}
