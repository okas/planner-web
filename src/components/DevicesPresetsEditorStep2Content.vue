<template>
  <div class="step-2 has-text-centered">
    <div class="field">
      <div class="control">
        <a class="button" role="button" :disabled="!$store.state.ioConnected" @click="refresh">
          <fa-i icon="sync-alt"/>
        </a>
      </div>
    </div>
    <div class="field is-horizontal" v-for="devType in deviceSelection" :key="devType.type">
      <div class="field-label is-normal">
        <label class="label has-text-grey" v-text="devType.name"/>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <tree-select
              placeholder="vali seadmed"
              :multiple="true"
              :options="devType.items"
              :normalizer="normalizer"
              v-model="selectedDevices[devType.type]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { TreeSelect },
  props: {
    preset: { type: Object, required: true },
    deviceSelection: { type: Array, required: true },
    selectedDevices: { type: Object, required: true }
  },
  methods: {
    refresh() {
      this.$emit('refreshDevices')
    },
    normalizer({ id, name, items }) {
      return {
        id,
        label: name || id,
        children: items
      }
    }
  }
}
</script>
