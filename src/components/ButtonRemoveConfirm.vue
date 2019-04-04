<template>
  <component
    :is="tag"
    role="button"
    class="remove-confirm button"
    :class="ask ? 'is-danger' : 'is-warning'"
    :disabled="disabled"
    :aria-disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
    @click.prevent.stop="changeState"
  >
    <i class="icon">
      <fa-i class="fa-lg" :icon="ask ? 'exclamation-circle' : 'trash'" />
    </i>
  </component>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'

export default {
  mixins: [disabled, removeDOMListeners],
  model: { event: 'change' },
  props: {
    tag: { type: String, default: 'a' },
    value: { type: Boolean, default: false }
  },
  data() {
    return { ask: this.value }
  },
  watch: {
    value(newValue) {
      this.ask = newValue
    }
  },
  methods: {
    changeState() {
      // Do nothing when IO is disconnected.
      if (this.disabled) {
        return
      }
      this.ask = !this.ask
      this.$emit('change', this.ask)
    }
  }
}
</script>
