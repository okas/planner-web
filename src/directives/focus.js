export const name = 'focus'

export const Focus = {
  async inserted(el, binding, vNode) {
    if (binding.expression == undefined || binding.value) {
      await vNode.context.$nextTick()
      el.focus()
    }
  },
  async componentUpdated(el, binding, vNode) {
    if (binding.value === binding.oldValue) {
      return
    }
    if (binding.value) {
      await vNode.context.$nextTick()
      el.focus()
    } else {
      await vNode.context.$nextTick()
      el.blur()
    }
  }
}

export const FocusDirectiveMixin = {
  directives: {
    [name]: Focus
  }
}
