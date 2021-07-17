import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';

import './style.scss';

export default class TabBar extends Component {
  getTemplate () {
    const { current, tabList } = this.props;
    return `
      <div class="tab-bar__container">
        ${
          tabList.map(({ id, label }, i) => {
            return (`
              <button
                id="tab-bar-${id}"
                class="${current === id ? 'current' : ''}"
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
    const { tabList } = this.props;

    tabList.forEach((tab, i) => {
      const { id, action } = tab;
      this.addEventListener('click', `#tab-bar-${id}`, action);
    });
  }
}
