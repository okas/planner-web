<template>
  <a
    role="button"
    class="ok button"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="check" />
    </i>
  </a>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'
export default { mixins: [disabled, removeDOMListeners] }
</script>
