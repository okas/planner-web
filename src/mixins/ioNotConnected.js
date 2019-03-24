/**
 * Adds computed property `disabled`.
 * Is `true` if IO is not connected.
 */
export const disabled = {
  computed: {
    disabled() {
      return !this.$store.state.ioConnected
    }
  }
}

/**
 * Adds computed property `listenersToggled`.
 * Based on IO connection state, toggles output to component's parent listeners or to null.
 */
export const removeDOMListeners = {
  computed: {
    listenersToggled() {
      return !this.$store.state.ioConnected ? null : this.$listeners
    }
  }
}
