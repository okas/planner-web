<template>
  <component
    :is="tag"
    role="button"
    class="add button"
    v-bind="$attrsInternal"
    v-on="$listenersInternal"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="plus" />
    </i>
  </component>
</template>

<script>
import connectionAwareButtonBase from '../mixins/connectionAwareButtonBase'

export default {
  mixins: [connectionAwareButtonBase]
}
</script>
