import Component from '../../../core/component.js';

import './style.scss';

export default class FAB extends Component {
  getTemplate () {
    return `
      <a href="/editor">
        <button class="fab__container">
          <i class="wmi wmi-add"></i>
        </button>
      </a>
    `;
  }
}
