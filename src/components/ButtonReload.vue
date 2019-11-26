<template>
  <component
    :is="tag"
    role="button"
    class="reload button"
    v-bind="$attrsInternal"
    v-on="$listenersInternal"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="sync-alt" />
    </i>
  </component>
</template>

<script>
import connectionAwareButtonBase from '../mixins/connectionAwareButtonBase'

export default {
  mixins: [connectionAwareButtonBase]
}
</script>
