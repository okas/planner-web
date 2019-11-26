<template>
  <component
    :is="tag"
    role="button"
    class="edit button"
    v-bind="$attrsInternal"
    v-on="$listenersInternal"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="cog" />
    </i>
  </component>
</template>

<script>
import connectionAwareButtonBase from '../mixins/connectionAwareButtonBase'

export default {
  mixins: [connectionAwareButtonBase]
}
</script>
