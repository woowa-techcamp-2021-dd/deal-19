const _ = {
  $: (selector, target = document) => target.querySelector(selector),
  $$: (selector, target = document) => target.querySelectorAll(selector)
};

export default _;
