import Component from '../../core/component.js';

import './dropdown.scss';

export default class Dropdown extends Component {
  initState () {
    this.state = {
      isOpen: false
    };
  }

  getTemplate () {
    const { isOpen } = this.state;
    const { buttonTemplate, position } = this.props;

    return `
      <div class="dropdown__container">
        ${buttonTemplate}
        <div class="dropdown__wrapper ${position}">
          ${isOpen ? this.renderDropdown() : ''}
        </div>
      </div>
    `;
  }

  setEventListener () {
    const { buttonList } = this.props;

    this.$target.addEventListener('click', (e) => {
      const { isOpen } = this.state;
      this.setState({ isOpen: !isOpen });
    });

    buttonList.forEach(({ action }, i) => {
      this.addEventListener('click', `#dropdown-button-${i}`, action);
    });
  }

  // Custom Method
  renderDropdown () {
    const { buttonList } = this.props;

    return `
      <div class="dropdown">
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
}
