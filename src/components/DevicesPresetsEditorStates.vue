<template>
  <div class="step-states">
    <div
      v-for="d in devices"
      :key="`${d.type}|${d.id}`"
      class="columns is-vcentered is-mobile"
    >
      <div class="column is-half has-text-right">
        <span class="device-path" v-text="getDevName(d)" />
      </div>
      <div class="column is-one-quarter">
        <input
          v-model.number.lazy="d.value"
          class="slider is-fullwidth is-marginless"
          type="range"
          min="0"
          max="1"
          :class="[getStep(d) < 1 ? 'is-success' : 'is-circle is-info']"
          :step="getStep(d)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['devicesData', 'getDevName'],
  props: {
    devices: { type: Array, required: true },
    isActive: { type: Boolean }
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

<style lang="scss" scoped>
.columns {
  margin-left: 0px;
  margin-right: 0px;
}
</style>
