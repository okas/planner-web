<template>
  <a
    role="button"
    class="add button"
    :disabled="disabled"
    :aria-disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="plus" />
    </i>
  </a>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'
export default { mixins: [disabled, removeDOMListeners] }
</script>
