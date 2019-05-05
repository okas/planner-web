import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'

export default {
  mixins: [disabled, removeDOMListeners],
  inheritAttrs: false,
  props: { tag: { type: String, default: 'a' } },
  computed: {
    $attrsInternal() {
      let { disabled, ...attrsRest } = this.$attrs
      delete attrsRest['aria-disabled']
      disabled = this.disabled || disabled
      return {
        disabled,
        'aria-disabled': disabled,
        ...attrsRest
      }
    },
    $listenersInternal() {
      return this.$attrsInternal.disabled ? null : this.listenersToggled
    }
  }
}
