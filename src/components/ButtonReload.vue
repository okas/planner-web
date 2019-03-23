<template functional>
  <a
    role="button"
    class="reload button"
    :disabled="data.disabled"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="sync-alt" />
    </i>
  </a>
</template>

<script>
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'
export default { mixins: [disabledIoNotConnected] }
</script>
