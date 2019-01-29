<template>
  <section id="devpresets">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-danger'"/>
      <p class="has-text-danger">Eelseadistuse haldus</p>
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <a
            class="button"
            role="button"
            title="Värskenda serverist"
            :disabled="!$store.state.ioConnected"
            @click="ioGetPresets"
          >
            <fa-i icon="sync-alt"/>
          </a>
        </div>
        <div class="control">
          <a class="button" role="button" title="Lisa automaattoiming" @click="create">
            <fa-i icon="plus"/>
          </a>
        </div>
      </div>
    </header>
    <div class="presets-grid">
      <article class="preset" v-for="p in presets" :key="p.id">
        <h3 class="name is-size-4" v-text="p.name"/>
        <span class="schedule" v-text="p.schedule"/>
        <div class="commands field is-grouped is-marginless">
          <div class="control">
            <button class="button is-small is-outlined is-light" @click="modify(p)">
              <span class="icon">
                <fa-i icon="cog"/>
              </span>
            </button>
          </div>
          <div class="control">
            <button class="button is-small is-outlined is-light">
              <span class="icon">
                <fa-i icon="play"/>
              </span>
            </button>
          </div>
        </div>
        <div class="devices-grid" v-for="d in p.devices" :key="`${d.type}|${d.id}`">
          <span class="order" v-text="p.setorder[d.id] || '='"/>
          <span class="device-path" v-text="d.name"/>
          <span class="device-value" v-text="d.val"/>
        </div>
      </article>
    </div>
    <editor
      class="component"
      :class="{'is-active': modalShow}"
      :preset-for-edit="presetToWork"
      @quit="quitEventHandler"
      @save="saveEventHandler"
      v-if="modalShow"
    >
      <h2 class="title is-2 has-text-danger" slot="header-title">Muuda eelseadistust</h2>
    </editor>
  </section>
</template>

<script>
import Editor from '../components/DevicesPresetsEditor'

export default {
  name: 'Presets',
  components: { Editor },
  data() {
    return {
      presets: [],
      presetToWork: null,
      editorMode: '',
      modalShow: false
    }
  },
  MODE_CREATE: 'create',
  MODE_MODIFY: 'modify',
  methods: {
    create() {
      this.editorMode = this.$options.MODE_CREATE
      this.presetToWork = {
        id: 0,
        name: '',
        schedule: '',
        devices: [],
        setorder: {}
      }
      this.modalShow = true
    },
    modify(preset) {
      this.editorMode = this.$options.MODE_MODIFY
      this.presetToWork = preset
      this.modalShow = true
    },
    saveEventHandler(preset) {
      this.modalShow = false
      if (this.editorMode === this.$options.MODE_CREATE) {
        this.saveCreated(preset)
      } else if (this.editorMode === this.$options.MODE_MODIFY) {
        this.saveModified(preset)
      }
      this.editorMode = this.presetToWork = null
    },
    saveCreated(preset) {
      if (
        !preset.name &&
        !preset.schedule &&
        preset.devices.length === 0 &&
        Object.keys(preset.setorder).length === 0
      ) {
        return
      }
      // ToDo handle case when API do not return at all or error!
      this.$socket.emit('presets-add', preset, ({ id, error }) => {
        if (error) {
          console.error(`preset-add: API responded with error: [ ${error} ]`)
          return
        }
        preset.id = id
        this.presets.push(preset)
      })
    },
    saveModified(preset) {
      this.$socket.emit('preset-update', preset, ({ status, error }) => {
        if (error) {
          console.error(`preset-update: API responded with error: [ ${error} ]`)
          return
        }
        Object.assign(this.presetToWork, preset)
      })
    },
    quitEventHandler() {
      this.modalShow = false
      this.presetToWork = this.editorMode = null
    },
    ioGetPresets() {
      this.$socket.emit('presets-get-all', data => {
        this.presets = data
      })
    }
  },
  created() {
    this.ioGetPresets()
  }
}
</script>

<style lang="scss" scoped>
.preset {
  margin-bottom: 3rem;
  display: grid;
  gap: 0.75rem;
  grid-template-areas:
    'name name'
    'schd cmmd';
  grid-template-columns: 15rem 10rem;
  .name {
    grid-area: name;
  }
  .schedule {
    grid-area: schd;
  }
  .commands {
    grid-area: cmmd;
  }
  .devices-grid {
    grid-column: 1 / 4;
    display: grid;
    gap: 0.2rem;
    grid-auto-flow: column;
    grid-template-columns: 2rem 12.5rem 1fr;
    grid-auto-rows: 1fr;
  }
}
</style>
