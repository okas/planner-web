/**
 * Adds computed property `disabled`.
 * Is `true` if IO is not connected.
 */
const disabledIoNotConnected = {
  computed: {
    disabled() {
      return !this.$store.state.ioConnected
    }
  }
}
export default disabledIoNotConnected
