<template>
  <section id="devpresets">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-danger'" />
      <p class="has-text-danger">Eelseadistuse haldus</p>
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <button-reload title="Värskenda serverist" @click="apiDataLoad" />
        </div>
        <div class="control">
          <button-add title="Lisa automaattoiming" @click="create" />
        </div>
      </div>
    </header>
    <div class="presets-grid">
      <item
        v-for="p in presets"
        :key="p.id"
        :preset="p"
        @modify="modify"
        @removeConfirm="removeConfirm"
      />
    </div>
    <remove-confirm
      v-if="modalRemoveConfirmShow"
      :class="{ 'is-active': modalRemoveConfirmShow }"
      :preset-name="presetToWork.name"
      @quit="quitEventHandler"
      @remove="removeConfirmedHandler"
    />
    <editor
      v-if="modalShow"
      class="component"
      :class="{ 'is-active': modalShow }"
      :preset-for-edit="presetToWork"
      @quit="quitEventHandler"
      @save="saveEventHandler"
    >
      <h2 slot="header-title" class="title is-2 has-text-danger">
        <span v-text="editorTitle" />
      </h2>
    </editor>
  </section>
</template>

<script>
import * as constants from '../constants/uiEditorConstants.js'
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Item from '../components/DevicesPresetsItem'
import RemoveConfirm from '../components/DevicesPresetsRemoveConfirm'
import Editor from '../components/DevicesPresetsEditor'

export default {
  name: 'Presets',
  components: { ButtonAdd, ButtonReload, Item, RemoveConfirm, Editor },
  mixins: [i18SelectMixin],
  data() {
    return {
      presets: [],
      presetToWork: null,
      editorMode: null,
      editorTitle: '',
      modalShow: false,
      modalRemoveConfirmShow: false,
      devicesData: []
    }
  },
  provide() {
    return Object.defineProperties(
      {},
      {
        getDevName: { value: this.getDevName },
        ioGetDeviceData: { value: this.ioGetDeviceData },
        devicesData: {
          enumerable: true,
          get: () => this.devicesData
        }
      }
    )
  },
  watch: {
    editorMode(val) {
      // ToDo i18n
      switch (val) {
        case constants.MODE_CREATE:
          this.editorTitle = 'Loo eelseadistus'
          this.modalShow = true
          break
        case constants.MODE_MODIFY:
          this.editorTitle = 'Muuda eelseadistust'
          this.modalShow = true
          break
        default:
          this.editorTitle = ''
          this.modalShow = false
      }
    }
  },
  created() {
    this.apiDataLoad()
  },
  methods: {
    apiDataLoad() {
      this.ioGetDeviceData()
      this.ioGetPresets()
    },
    create() {
      this.editorMode = constants.MODE_CREATE
      this.presetToWork = {
        id: 0,
        name: '',
        active: false,
        schedule: '',
        devices: []
        // setorder: {}
      }
    },
    modify(preset) {
      this.editorMode = constants.MODE_MODIFY
      this.presetToWork = preset
    },
    removeConfirm(preset) {
      this.presetToWork = preset
      this.modalRemoveConfirmShow = true
    },
    removeConfirmedHandler() {
      this.modalRemoveConfirmShow = false
      this.remove(this.presetToWork)
      this.presetToWork = null
    },
    remove(preset) {
      this.$socket.emit('preset-remove', preset.id, ({ status, error }) => {
        if (error) {
          console.error(`preset-remove: API responded with error: [ ${error} ]`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event 'preset-remove' responded with status ${status}.`
          )
          if (status !== 'no-exist') {
            return
          }
        }
        // ToDo add some 'toast' notifications or useer to show if all was not 100% OK!
        this.$delete(this.presets, this.presets.indexOf(preset))
      })
    },
    saveEventHandler(preset) {
      if (this.editorMode === constants.MODE_CREATE) {
        this.saveCreated(preset)
      } else if (this.editorMode === constants.MODE_MODIFY) {
        this.saveModified(preset)
      }
      this.editorMode = null
    },
    saveCreated(preset) {
      if (
        !preset.name &&
        !preset.schedule &&
        preset.devices.length ===
          0 /*  &&
        Object.keys(preset.setorder).length === 0 */
      ) {
        return
      }
      // ToDo handle case when API do not respond!
      this.$socket.emit('presets-add', preset, ({ id, error }) => {
        if (error) {
          console.error(`preset-add: API responded with error: [ ${error} ]`)
          return
        }
        preset.id = id
        this.presets.push(preset)
        this.presetToWork = null
      })
    },
    saveModified(preset) {
      this.$socket.emit('preset-update', preset, ({ status, error }) => {
        if (error) {
          console.error(`preset-update: API responded with error: [ ${error} ]`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event 'preset-update' responded with status ${status}.`
          )
          return
        }
        Object.assign(this.presetToWork, preset)
        this.presetToWork = null
      })
    },
    quitEventHandler() {
      this.modalRemoveConfirmShow = false
      this.presetToWork = this.editorMode = null
    },
    getDevice(id, type) {
      const group = this.devicesData.find(g => g.type === type)
      if (!group) {
        return null
      }
      const device = group.items.find(d => d.id === id)
      return device ? { ...device, typeName: group.name } : null
    },
    getDevName({ id, type }) {
      const dev = this.getDevice(id, type)
      return dev ? `${dev.typeName} / ${dev.room} / ${dev.name}` : null
    },
    ioGetPresets() {
      this.$socket.emit('presets-get-all', data => {
        this.presets = data
      })
    },
    ioGetDeviceData() {
      this.$socket.emit(
        'presets-get-devices-selection',
        this.$language,
        data => (this.devicesData = data)
      )
    }
  }
}
</script>
