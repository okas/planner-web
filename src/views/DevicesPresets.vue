<template>
  <section id="devpresets">
    <header>
      <slot name="header-title" :_class="'has-text-danger'"/>
      <p class="has-text-danger">Eelseadistuse haldus</p>
      <a class="button" @click="ioGetPresets">
        <f-a icon="sync-alt"/>
      </a>
    </header>
    <div class="presets-grid">
      <article class="preset" v-for="p in presets" :key="p.id">
        <h3 class="name is-size-4" v-text="p.name"/>
        <span class="schedule" v-text="p.schedule"/>
        <div class="buttons is-marginless">
          <button class="button is-small">Käivita</button>
          <button class="button is-small" @click="editPreset(p)">Muuda</button>
        </div>
        <div class="devices-grid" v-for="d in p.devices" :key="d.id">
          <span class="order" v-text="p.setorder[d.id] || '='"/>
          <span class="device-path" v-text="d.path"/>
          <span class="device-value" v-text="d.val"/>
        </div>
      </article>
    </div>
    <edit-modal
      class="edit-preset"
      :class="{'is-active': modalShow}"
      :preset="presetForEdit"
      @quit="quitEdit"
      @save="savePreset"
      v-if="modalShow"
    />
  </section>
</template>

<script>
import EditModal from '../components/DevicesPresetsEditModal'

export default {
  name: 'Presets',
  components: { EditModal },
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
          setorder: { 0: 1, 1: 2 },
          schedule: 'iga päev 08:00',
          devices: [
            { id: 0, path: 'Lamp 1 / Magamistuba', val: 1 },
            { id: 1, path: 'Ruloo 1 / Magamistuba', val: 0.5 }
          ]
        },
        {
          id: 1,
          name: 'Elutoa hommik',
          setorder: { 0: null, 1: 1, 2: 2 },
          schedule: 'iga päev 08:00',
          devices: [
            { id: 0, path: 'Lamp 2 / Elutuba', val: 1 },
            { id: 1, path: 'Lamp 2 / Elutuba', val: 1 },
            { id: 2, path: 'Laua kohal 1 / Köök', val: 0.75 },
            { id: 3, path: 'Ruloo 2 / Elutuba', val: 0.75 }
          ]
        },
        {
          id: 2,
          name: 'Jareki hommik',
          setorder: { 0: null, 1: null },
          schedule: 'iga päev 06:30',
          devices: [
            { id: 0, path: 'Laelamp / Jareki tuba', val: 1 },
            { id: 1, path: 'Ruloo 1 / Jareki tuba', val: 0.5 }
          ]
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
  .buttons {
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
