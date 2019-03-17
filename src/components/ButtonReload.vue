<template>
  <div class="control">
    <a
      class="button"
      role="button"
      :disabled="disabled"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <fa-i icon="sync-alt" />
    </a>
  </div>
</template>

<script>
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'
export default {
  mixins: [disabledIoNotConnected],
  inheritAttrs: false
}
</script>
