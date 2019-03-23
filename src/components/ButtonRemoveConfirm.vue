<template>
  <a
    role="button"
    class="remove-confirm button"
    :class="confirmed ? 'is-warning' : 'is-danger'"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
    @click.prevent.stop="changeState"
  >
    <i class="icon">
      <fa-i class="fa-lg" :icon="confirmed ? 'trash' : 'exclamation-circle'" />
    </i>
  </a>
</template>

<script>
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'

export default {
  mixins: [disabledIoNotConnected],
  data() {
    return {
      confirmed: true
    }
  },
  watch: {
    confirmed(newValue) {
      if (newValue) this.$emit('confirm')
    }
  },
  methods: {
    changeState() {
      this.confirmed = !this.confirmed
    }
  }
}
</script>
