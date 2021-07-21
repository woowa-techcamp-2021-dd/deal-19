import Component from '../core/component.js';
import _ from '../utils/dom.js';

import './modal.scss';

export default class Modal extends Component {
  getTemplate () {
    const {
      type,
      text,
      placeholder = '',
      value = '',
      confirmText = '확인'
    } = this.props;

    return `
      <div class="modal-background">
        <div class="modal">
          <div class="text">${text}</div>
          ${type === 'prompt'
    ? (
      `<input
              class="input full"
              placeholder="${placeholder}"
              value="${value}"
            >`
    )
    : ''}
          <div class="modal-button-wrapper">
            <button class="modal-button right" id="modal-confirm">
              ${confirmText}
            </button>
            ${
  type !== 'alert'
    ? '<button class="modal-button left" id="modal-cancel">취소</button>'
    : ''
}
          </div>
        </div>
      </div>
    `;
  }

  setEventListener () {
    const { type, action } = this.props;

    const createConfirmAction = (action) => {
      return function () {
        if (action) {
          if (type === 'prompt') {
            const townName = _.$('.input.full').value;
            action(townName);
          } else {
            action();
          }
        }
        this.closeModal();
      };
    };

    const onConfirm = createConfirmAction(action);
    const onClose = createConfirmAction();

    this.addEventListener('click', '#modal-confirm', onConfirm.bind(this));

    type !== 'alert' && this.addEventListener('click', '#modal-cancel', onClose.bind(this));
  }

  closeModal () {
    _.$('.modal-background').remove();
  }
}
