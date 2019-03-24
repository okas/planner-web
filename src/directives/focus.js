export const name = 'focus'

export const Focus = {
  inserted(el) {
    el.focus()
  }
}

export const FocusDirectiveMixin = {
  directives: {
    [name]: Focus
  }
}
