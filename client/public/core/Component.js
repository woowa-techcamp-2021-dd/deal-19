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

  setState (newState) {
    this.state = { ...this.state, ...newState };
    this._render();
  }

  addEventListener (eventType, selector, callback) {
    const _children = [..._.$$(selector, this.$target)];

    this.$target.addEventListener(eventType, (e) => {
      if (!this._isTarget(e.target, _children, selector)) return false;
      callback(e);
    });
  }

  didInitialMount () {}

  _setup () {
    this.initState();
    this._render();
    this.setEventListener();
    this.didInitialMount();
  }

  _render () {
    this.$target.innerHTML = this.getTemplate();
    this.mountChildren();
  }

  _isTarget (target, children, selector) {
    return children.includes(target) || target.closest(selector);
  }
}
