<template>
  <div class="devices-grid" :class="{ 'has-text-warning': !device.name }">
    <!-- <span class="order" v-text="preset.setorder[d.id] || '='" /> -->
    <span class="device-path has-text-right" v-text="name" />
    <span class="device-value" v-text="device.value" />
  </div>
</template>

<script>
export default {
  props: { device: { type: Object, required: true } },
  computed: {
    name() {
      return this.device.name
        ? this.device.name
        : `N/A { ${this.device.type}->${this.device.id} }`
    }
  }
}
</script>

<style lang="scss" scoped>
.devices-grid {
  // grid-column: 1 / 4;
  grid-column: 1 / 3;
  display: grid;
  gap: 0.7rem;
  grid-auto-flow: column;
  grid-template-columns: /* 2rem */ 17rem 3rem;
  grid-auto-rows: 1fr;
}
</style>
