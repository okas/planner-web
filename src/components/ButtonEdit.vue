<template functional>
  <a
    class="edit button"
    role="button"
    :disabled="data.disabled"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <fa-i icon="cog" />
  </a>
</template>

<script>
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'
export default { mixins: [disabledIoNotConnected] }
</script>
