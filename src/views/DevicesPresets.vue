<template>
  <section id="devpresets">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-danger'" />
      <p class="has-text-danger">Eelseadistuse haldus</p>
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <button-reload title="Värskenda serverist" @click="apiDataReload" />
        </div>
        <div class="control">
          <button-add title="Lisa automaattoiming" @click="create" />
        </div>
      </div>
    </header>
    <div class="presets-grid">
      <item
        v-for="p in presets"
        :id="`item${p.id}`"
        :key="p.id"
        :class="{ 'highlight-preset': highlightItem === `item${p.id}` }"
        :preset="p"
        @modify="modify"
        @setActive="setActiveHandler"
        @remove="removeHandler"
      />
    </div>
    <editor
      v-if="modalShow"
      class="component"
      :class="{ 'is-active': modalShow }"
      :preset-for-edit="presetToWork"
      @quit="quitEventHandler"
      @save="saveEventHandler"
    >
      <h2
        slot="header-title"
        class="title is-2 has-text-danger"
        v-text="editorTitle"
      />
    </editor>
  </section>
</template>

<script>
import * as constants from '../constants/uiEditorConstants.js'
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import ButtonReload from '../components/ButtonReload'
import ButtonAdd from '../components/ButtonAdd'
import Item from '../components/DevicesPresetsItem'
import Editor from '../components/DevicesPresetsEditor'

export default {
  name: 'Presets',
  components: { ButtonAdd, ButtonReload, Item, Editor },
  mixins: [i18SelectMixin],
  data() {
    return {
      presets: [],
      presetToWork: null,
      editorMode: null,
      editorTitle: '',
      modalShow: false,
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
  computed: {
    highlightItem() {
      return this.$route.hash ? this.$route.hash.substring(1) : ''
    }
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
  beforeRouteEnter(to, from, next) {
    next(vm => vm.ioGetPresets(vm.navigateToHashAfterDataRender))
  },
  created() {
    this.ioGetDeviceData()
  },
  methods: {
    async navigateToHashAfterDataRender() {
      if (this.$route.hash) {
        await this.$nextTick()
        window.location.href = this.$route.fullPath
      }
    },
    apiDataReload() {
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
    removeHandler(presetId) {
      const event = 'preset-remove'
      this.$socket.emit(event, presetId, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: " ${errors} " `)
          return
        }
        if (status !== 'ok') {
          console.warn(`API event '${event}' responded with status ${status}.`)
          if (status !== 'no-exist') {
            return
          }
        }
        // ToDo add some 'toast' notifications or useer to show if all was not 100% OK!
        this.$delete(
          this.presets,
          this.presets.findIndex(p => p.id == presetId)
        )
      })
    },
    setActiveHandler(preset, newState) {
      const event = 'presets-set-active'
      const payload = { id: preset.id, active: newState }
      this.$socket.emit(event, payload, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: " ${errors} "`)
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event '${event}' responded with status " ${status} ".`
          )
          return
        }
        preset.active = newState
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
      const event = 'presets-add'
      // ToDo handle case when API do not respond!
      this.$socket.emit(event, preset, ({ id, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with errors: [ ${errors} ]`)
          // ToDo say it with toast/snackbar/notification!
          return
        }
        preset.id = id
        this.presets.push(preset)
        this.presetToWork = null
      })
    },
    saveModified(preset) {
      // ToDo add some 'toast' notifications or useer to show if all was not 100% OK!
      const event = 'preset-update'
      this.$socket.emit(event, preset, ({ status, errors }) => {
        if (errors && errors.length > 0) {
          console.error(`${event}: API responded with error: [ ${errors} ]`)
          return
        }
        if (status !== 'ok') {
          console.warn(`API event '${event}' responded with status ${status}.`)
          return
        }
        Object.assign(this.presetToWork, preset)
        this.presetToWork = null
      })
    },
    quitEventHandler() {
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
    ioGetPresets(fn = null) {
      this.$socket.emit('presets-get-all', data => {
        this.presets = data
        if (typeof fn === 'function') {
          fn()
        }
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

<style lang="scss" scoped>
.highlight-preset {
  box-shadow: inset 0px 0px 14px 1.5px $info;
}
</style>
