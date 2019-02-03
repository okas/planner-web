<template>
  <div class="step-2 has-text-centered">
    <div class="field">
      <div class="control">
        <a
          class="button"
          role="button"
          :disabled="!$store.state.ioConnected"
          @click="reload"
        >
          <fa-i icon="sync-alt" />
        </a>
      </div>
    </div>
    <div
      v-for="devType in roomGroupedDeviceSelection"
      :key="devType.type"
      class="field is-horizontal"
    >
      <div class="field-label is-normal">
        <label class="label has-text-grey" v-text="devType.name" />
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <tree-select
              v-model="selectedModels[devType.type]"
              placeholder="vali seadmed"
              value-consists-of="LEAF_PRIORITY"
              :show-count="true"
              :multiple="true"
              :disable-branch-nodes="true"
              :options="devType.items"
              @close="save"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { TreeSelect },
  mixins: [i18SelectMixin],
  props: {
    devices: { type: Array, required: true },
    deviceSelection: { type: Array, required: true }
  },
  data() {
    return {
      initialSelected: JSON.parse(JSON.stringify(this.devices))
    }
  },
  computed: {
    selectedModels: {
      get() {
        return this.initialSelected.reduce((groups, { type, id }) => {
          const g = groups[type] || (groups[type] = [])
          g.push(id)
          return groups
        }, {})
      }
    },
    roomGroupedDeviceSelection() {
      return this.deviceSelection.map(({ items, ...group }) => {
        return {
          ...group,
          items: this.getRoomGroup(items)
        }
      })
    }
  },
  watch: {
    deviceSelection(val) {
      /* This will rename selected devices names, in case of source device name rename */
      if (val.length > 0) this.save()
    }
  },
  methods: {
    reload() {
      this.$emit('reloadDeviceSelection')
    },
    save() {
      this.$emit('saveSelectedDevices', this.createNewPresetDevices())
    },
    createNewPresetDevices() {
      return Object.entries(this.selectedModels).reduce((accu, group) => {
        Array.prototype.push.apply(accu, this.createPresetDevicesForType(group))
        return accu
      }, [])
    },
    createPresetDevicesForType([type, selectedDevIds]) {
      const deviceGroup = this.deviceSelection.find(g => g.type === type)
      return selectedDevIds.map(id => {
        const { name, room } = deviceGroup.items.find(d => d.id == id)
        const { value = 0 } = this.initialSelected.find(d => d.id === id) || {}
        return { id, type, name: `${name} / ${room}`, value }
      })
    },
    getRoomGroup(deviceGroupItems) {
      return deviceGroupItems.reduce((acc, { id, name: label, room }) => {
        const group = acc.find(g => g.id === room)
        if (group) {
          group.children.push({ id, label })
        } else {
          acc.push({ id: room, label: room, children: [{ id, label }] })
        }
        return acc
      }, [])
    }
  }
}
</script>
