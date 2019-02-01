<template>
  <div class="step-2 has-text-centered">
    <div class="field">
      <div class="control">
        <a
          class="button"
          role="button"
          :disabled="!$store.state.ioConnected"
          @click="ioGetDeviceSelection"
        >
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
              value-consists-of="LEAF_PRIORITY"
              :show-count="true"
              :multiple="true"
              :disable-branch-nodes="true"
              :options="devType.items"
              :normalizer="treeselectNormalizer"
              v-model="selectedDevicesObj[devType.type]"
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
  mixins: [i18SelectMixin],
  components: { TreeSelect },
  props: {
    selectedDevices: { type: Array, required: true }
  },
  data() {
    return {
      deviceSelection: [],
      i_selected: [...this.selectedDevices]
    }
  },
  computed: {
    selectedDevicesObj: {
      get() {
        return this.i_selected.reduce((groups, { type, id }) => {
          const g = groups[type] || (groups[type] = [])
          g.push(id)
          return groups
        }, {})
      }
    }
  },
  methods: {
    save() {
      this.$emit('saveSelectedDevices', this.createNewPresetDevices())
    },
    createNewPresetDevices() {
      return Object.entries(this.selectedDevicesObj).reduce((accu, group) => {
        Array.prototype.push.apply(accu, this.createNewTypeDevices(group))
        return accu
      }, [])
    },
    createNewTypeDevices([type, selectedDevIds]) {
      const srcDevsWithRooms = this.flattenTypeDevicesWithRooms(type)
      return selectedDevIds.map(id => {
        const { name, room } = srcDevsWithRooms.find(d => d.id == id)
        const { value } = this.i_selected.find(d => d.id === id) || {}
        return { id, type, name: `${name} / ${room}`, value }
      })
    },
    flattenTypeDevicesWithRooms(type) {
      const group = this.deviceSelection.find(g => g.type === type)
      return group.items.reduce((accu, { id: room, items }) => {
        Array.prototype.push.apply(
          accu,
          items.map(device => {
            return { ...device, room }
          })
        )
        return accu
      }, [])
    },
    treeselectNormalizer({ id, name, items }) {
      return { id, label: name || id, children: items }
    },
    ioGetDeviceSelection() {
      this.$socket.emit(
        'presets-get-devices-selection',
        this.$language,
        data => (this.deviceSelection = data)
      )
    }
  },
  watch: {
    deviceSelection(val, oledVal) {
      /* This will rename selected devices names, in case of source device name rename */
      if (val.length > 0) this.save()
    }
  },
  created() {
    this.ioGetDeviceSelection()
  }
}
</script>
