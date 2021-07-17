import Component from '../core/component.js';
import _ from '../utils/dom.js';

import './dropdown.scss';

export default class Dropdown extends Component {
  getTemplate () {
    const { buttonList } = this.props;

    return `
      <div class="dropdown__container">
        ${
          buttonList.map((button, i) => {
            const { label, color } = button;

            return (`
              <button
                id="dropdown-button-${i}"
                ${color ? `style="color: ${color}"` : ''}
              >
                ${label}
              </button>
            `);
          }).join('')
        }
      </div>
    `;
  }

  setEventListener () {
    const { buttonList } = this.props;

    this.$target.addEventListener('mouseenter', () => {
      _.$('.dropdown__container').classList.add('open');
    });

    this.$target.addEventListener('mouseleave', () => {
      _.$('.dropdown__container').classList.remove('open');
    });

    buttonList.forEach(({ action }, i) => {
      this.addEventListener('click', `#dropdown-button-${i}`, action);
    });
  }
}
