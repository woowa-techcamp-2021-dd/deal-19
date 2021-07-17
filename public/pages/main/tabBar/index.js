import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';

import './style.scss';

export default class TabBar extends Component {
  getTemplate () {
    const { tabList } = this.props;
    return `
      <div class="tab-bar__container">
        ${
          tabList.map((tab, i) => {
            const { label } = tab;
            return (`
              <button id="tab-bar-button-${i}">${label}</button>
            `);
          }).join('')
        }
      </div>
    `;
  }

  setEventListener () {
    const { tabList } = this.props;

    const focusTab = (action) => (e) => {
      _.$$('.tab-bar__container > button').forEach(($tab) => {
        $tab.classList.remove('current');
      });
      e.target.classList.add('current');
      action();
    };

    tabList.forEach((tab, i) => {
      const { action } = tab;
      this.addEventListener('click', `#tab-bar-button-${i}`, focusTab(action));
    });
  }
}
