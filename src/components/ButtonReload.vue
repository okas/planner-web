<template functional>
  <a
    class="button"
    role="button"
    :disabled="data.disabled"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <fa-i icon="sync-alt" />
  </a>
</template>

<script>
// Todo remove wrapper
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'
export default { mixins: [disabledIoNotConnected] }
</script>
