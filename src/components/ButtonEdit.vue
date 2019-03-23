<template functional>
  <a
    role="button"
    class="edit button"
    :disabled="data.disabled"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="cog" />
    </i>
  </a>
</template>

<script>
import disabledIoNotConnected from '../mixins/disabled-ioNotConnected.js'
export default { mixins: [disabledIoNotConnected] }
</script>
