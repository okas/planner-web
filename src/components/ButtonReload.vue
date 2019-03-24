<template>
  <component
    :is="tag"
    role="button"
    class="reload button"
    :disabled="disabled"
    :aria-disabled="disabled"
    v-bind="$attrs"
    v-on="listenersToggled"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="sync-alt" />
    </i>
  </component>
</template>

<script>
import { disabled, removeDOMListeners } from '../mixins/ioNotConnected'

export default {
  mixins: [disabled, removeDOMListeners],
  props: { tag: { type: String, default: 'a' } }
}
</script>
