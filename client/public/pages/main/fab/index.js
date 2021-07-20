import Component from '../../../core/component.js';

import './style.scss';

export default class FAB extends Component {
  getTemplate () {
    return `
      <button class="fab__container">
        <i class="wmi wmi-add"></i>
      </button>
    `;
  }

  setEventListener () {
    this.addEventListener('click', '.fab__container', () => {
      console.log('click fab');
    });
  }
}
