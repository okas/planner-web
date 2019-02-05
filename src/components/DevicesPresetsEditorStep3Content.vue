<template>
  <div class="step-3 has-text-centered">
    <div v-for="d in devices" :key="`${d.type}|${d.id}`" class="devices-grid">
      <span class="device-path" v-text="getDevName(d)" />
      <input
        v-model.number.lazy="d.value"
        class="slider is-info"
        type="range"
        min="0"
        max="1"
        :step="getStep(d)"
      />
    </div>
  </div>
</template>

<script>
export default {
  inject: ['devicesData', 'getDevName'],
  props: {
    devices: { type: Array, required: true }
  },
  methods: {
    getStep({ id, type }) {
      const group = this.devicesData.find(g => g.type === type)
      if (!group) {
        return 1
      }
      return group.items.find(d => d.id === id).valuestep || 1
    }
  }
}
</script>
