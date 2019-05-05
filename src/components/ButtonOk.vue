<template>
  <component
    :is="tag"
    role="button"
    class="ok button"
    v-bind="$attrsInternal"
    v-on="$listenersInternal"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="check" />
    </i>
  </component>
</template>

<script>
import buttonBase from '../mixins/buttonBase'

export default {
  mixins: [buttonBase]
}
</script>
