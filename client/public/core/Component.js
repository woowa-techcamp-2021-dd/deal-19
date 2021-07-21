import _ from '../utils/dom.js';

export default class Component {
  constructor ($target, props = {}) {
    this.$target = $target;
    this.props = props;
    this.state = {};
    this.children = [];
    this._setup();
  }

  initState () {}

  getTemplate () {
    return '';
  }

  mountChildren () {}

  setEventListener () {}

  didMount () {}

  setState (newState, isFromDidMount = false) {
    this.state = { ...this.state, ...newState };
    this._render(isFromDidMount);
  }

  addEventListener (eventType, selector, callback) {
    const _children = [..._.$$(selector, this.$target)];

    this.$target.addEventListener(eventType, (e) => {
      if (!this._isTarget(e.target, _children, selector)) return false;
      callback(e);
    });
  }

  _setup () {
    this.initState();
    this._render();
    this.setEventListener();
  }

  _render (isFromDidMount) {
    this.$target.innerHTML = '';
    this.$self = document.createElement('div');
    this.$target.append(this.$self);
    this.$self.outerHTML = this.getTemplate();
    this.mountChildren();
    if (!isFromDidMount) {
      this.didMount();
    }
  }

  _isTarget (target, children, selector) {
    return children.includes(target) || target.closest(selector);
  }
}
