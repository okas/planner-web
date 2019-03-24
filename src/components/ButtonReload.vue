<template>
  <a
    role="button"
    class="reload button"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="sync-alt" />
    </i>
  </a>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'
export default { mixins: [disabled, removeDOMListeners] }
</script>
