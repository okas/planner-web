<template>
  <component
    :is="tag"
    role="button"
    class="remove-confirm button"
    :class="ask ? 'is-danger' : defaultStateClass"
    v-bind="$attrsInternal"
    v-on="$listenersInternal"
    @click.prevent.stop="changeState"
  >
    <i class="icon">
      <fa-i class="fa-lg" :icon="ask ? 'exclamation-circle' : 'trash'" />
    </i>
  </component>
</template>

<script>
import connectionAwareButtonBase from '../mixins/connectionAwareButtonBase'

export default {
  mixins: [connectionAwareButtonBase],
  model: { event: 'change' },
  props: {
    value: { type: Boolean, default: false },
    askTimeout: { type: Number, default: 0 },
    defaultStateClass: { type: String, default: 'is-warning' }
  },
  data() {
    return { ask: this.value, timeout: null }
  },
  watch: {
    value(newValue) {
      this.ask = newValue
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  methods: {
    changeState() {
      // Do nothing when IO is disconnected.
      if (this.disabled) {
        return
      }
      if (this.askTimeout > 0) {
        this.timeout = setTimeout(this.resetAsk, this.askTimeout, this)
      }
      this.ask = !this.ask
      this.$emit('change', this.ask)
    },
    resetAsk() {
      this.ask = false
      this.timeout = null
    }
  }
}
</script>
