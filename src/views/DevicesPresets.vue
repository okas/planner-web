<template>
  <section id="devpresets">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-danger'"/>
      <p class="has-text-danger">Eelseadistuse haldus</p>
      <a class="button" role="button" :disabled="!$store.state.ioConnected" @click="ioGetPresets">
        <fa-i icon="sync-alt"/>
      </a>
    </header>
    <div class="presets-grid">
      <article class="preset" v-for="p in presets" :key="p.id">
        <h3 class="name is-size-4" v-text="p.name"/>
        <span class="schedule" v-text="p.schedule"/>
        <div class="commands field is-grouped is-marginless">
          <div class="control">
            <button class="button is-small is-outlined is-light" @click="editPreset(p)">
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
        <div class="devices-grid" v-for="d in p.devices" :key="d.id">
          <span class="order" v-text="p.setorder[d.id] || '='"/>
          <span class="device-path" v-text="d.name"/>
          <span class="device-value" v-text="d.val"/>
        </div>
      </article>
    </div>
    <editor
      class="component"
      :class="{'is-active': modalShow}"
      :preset-for-edit="presetForEdit"
      @quit="quitEdit"
      @save="savePreset"
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
      presetForEdit: {},
      modalShow: false
    }
  },
  methods: {
    editPreset(preset) {
      this.presetForEdit = preset
      this.modalShow = true
    },
    savePreset(preset) {
      this.modalShow = false
      Object.assign(this.presetForEdit, preset)
      this.presetForEdit = null
    },
    quitEdit() {
      this.presetForEdit = null
      this.modalShow = false
    },
    ioGetPresets() {
      this.presets = [
        {
          id: 0,
          name: 'Magamistoa hommik',
          schedule: 'iga päev 08:00',
          devices: [],
          setorder: { 0: 1, 1: 2 }
        },
        {
          id: 1,
          name: 'Elutoa hommik',
          schedule: 'iga päev 08:00',
          devices: [
            { id: 1, name: 'Lamp 1 / Elutuba', type: 'room_lamps', val: 1 },
            { id: 2, name: 'Lamp 2 / Elutuba', type: 'room_lamps', val: 1 },
            {
              id: 3,
              name: 'Laua kohal 1 / Köök',
              type: 'room_lamps',
              val: 0.75
            },
            { id: 4, name: 'Ruloo 2 / Elutuba', type: 'room_blinds', val: 0.75 }
          ],
          setorder: { 0: null, 1: 1, 2: 2 }
        },
        {
          id: 2,
          name: 'Jareki hommik',
          schedule: 'iga päev 06:30',
          devices: [
            {
              id: 1,
              name: 'Laelamp / Jareki tuba',
              type: 'room_lamps',
              val: 1
            },
            {
              id: 2,
              name: 'Ruloo 1 / Jareki tuba',
              type: 'room_blinds',
              val: 0.5
            }
          ],
          setorder: { 0: null, 1: null }
        }
      ]
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
