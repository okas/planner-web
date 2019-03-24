<template>
  <a
    role="button"
    class="remove-confirm button"
    :class="confirmed ? 'is-warning' : 'is-danger'"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
    @click.prevent.stop="changeState"
  >
    <i class="icon">
      <fa-i class="fa-lg" :icon="confirmed ? 'trash' : 'exclamation-circle'" />
    </i>
  </a>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'

export default {
  mixins: [disabled, removeDOMListeners],
  data() {
    return {
      confirmed: true
    }
  },
  watch: {
    disabled(newValue) {
      if (newValue) {
        this.confirmed = true
      }
    }
  },
  methods: {
    changeState() {
      // Do nothing when IO is disconnected.
      if (this.disabled) {
        return
      }
      // Checking before state toggle, so need to get opposite of curretn state.
      if (!this.confirmed) {
        this.$emit('confirm')
      }
      this.confirmed = !this.confirmed
    }
  }
}
</script>
