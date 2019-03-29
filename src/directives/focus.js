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
    await vNode.context.$nextTick()
    if (binding.value) {
      el.focus()
    } else {
      el.blur()
    }
  }
}

export const FocusDirectiveMixin = {
  directives: {
    [name]: Focus
  }
}
