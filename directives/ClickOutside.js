import Vue from 'vue'

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el or its childrens
      const isClickOnElem = el === event.target || el.contains(event.target)
      let shouldHide = !isClickOnElem

      if (binding.arg) {
        const toggler = document.getElementById(binding.arg)
        const isClickOnToggler =
          toggler === event.target || toggler.contains(event.target)

        // here I check that click was outside the el, its toggle and its childrens
        shouldHide = !isClickOnElem && !isClickOnToggler
      }

      if (shouldHide) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})
