<template>
  <article
    class="preset-item box"
    :class="{ 'has-missing-devices': hasMissingDevices }"
  >
    <h3 class="name is-size-4" v-text="preset.name" />
    <span class="schedule" :title="preset.schedule" v-text="cronDescription" />
    <div class="commands field is-grouped is-marginless">
      <div class="switch-container control" :title="activeTitle">
        <input
          :id="`setAct|${preset.id}`"
          v-model="preset.active"
          class="switch is-outlined"
          type="checkbox"
          :name="`setAct|${preset.id}`"
          :disabled="disableSetActive"
          @change="saveActiveState(preset, $event.target.checked)"
        />
        <label :for="`setAct|${preset.id}`" />
      </div>
      <div class="control">
        <button
          class="button is-small is-outlined is-light"
          title="Kustuta automaattoiming"
          @click="$emit('removeConfirm', preset)"
        >
          <i class="icon">
            <fa-i class="fa-lg" icon="trash" />
          </i>
        </button>
      </div>
      <div class="control">
        <button-edit
          title="Muuda automaattoiming"
          class="is-small is-outlined is-light"
          @click="$emit('modify', preset)"
        />
      </div>
      <div class="control">
        <button class="button is-small is-outlined is-light">
            <i class="icon">
              <fa-i class="fa-lg" icon="play" />
            </i>
        </button>
      </div>
    </div>
    <device v-for="d in devices" :key="`${d.type}.${d.id}`" :device="d" />
  </article>
</template>

<script>
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import cronstrue from 'cronstrue/i18n'
import ButtonEdit from '../components/ButtonEdit'
import Device from '../components/DevicesPresetsItemDevice'

export default {
  components: { ButtonEdit, Device },
  mixins: [i18SelectMixin],
  inject: ['getDevName'],
  props: { preset: { type: Object, required: true } },
  computed: {
    devices() {
      return this.preset.devices.map(pd => ({
        ...pd,
        name: this.getDevName(pd, true)
      }))
    },
    cronDescription() {
      return this.preset.schedule
        ? cronstrue.toString(this.preset.schedule, {
        locale: this.$language
      })
        : ''
    },
    disableSetActive() {
      return !this.preset.schedule || !this.$store.state.ioConnected
    },
    activeTitle() {
      // ToDo i18n
      return !this.preset.active ? 'Määra aeg' : ''
    },
    hasMissingDevices() {
      return this.devices.some(d => !d.name)
    }
  },
  watch: {
    'preset.schedule'(val) {
      if (!val) {
        this.preset.active = val ? true : false
      }
    }
  },
  methods: {
    saveActiveState(preset, newState) {
      const payload = { id: preset.id, active: newState }
      this.$socket.emit('presets-set-active', payload, ({ status, error }) => {
        if (error) {
          console.error(
            `presets-set-active: API responded with error: [ ${error} ]`
          )
          return
        }
        if (status !== 'ok') {
          console.warn(
            `API event 'presets-set-active' responded with status ${status}.`
          )
          return
        }
        preset.active = newState
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.preset-item {
  margin-bottom: 3rem;
  display: grid;
  gap: 0.75rem;
  grid-template-areas:
    'name name'
    'schd cmmd';
  grid-template-columns: 15rem 12rem;
  &.has-missing-devices {
    box-shadow: $box-shadow-warning;
  }
  .name {
    grid-area: name;
  }
  .schedule {
    grid-area: schd;
  }
  .commands {
    grid-area: cmmd;
    .switch-container {
      padding-top: 0.225rem;
  }
  }
}
</style>
