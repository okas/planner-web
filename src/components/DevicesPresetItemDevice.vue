<template>
  <div class="devices-grid" :class="{ 'has-text-warning': !device.name }">
    <!-- <span class="order" v-text="preset.setorder[d.id] || '='" /> -->
    <span class="device-path has-text-right" v-text="name" />
    <span class="device-value has-text-right" v-text="device.value" />
    <div class="device-task-state has-text-right">
      <slot name="task-state" />
    </div>
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
  display: grid;
  gap: 0.7rem;
  grid-auto-flow: column;
  grid-template-columns: 17rem 2.5rem 2.5rem;
}
</style>
