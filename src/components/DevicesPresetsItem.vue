<template>
  <article class="preset-item">
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
          <span class="icon">
            <i class="icon">
              <fa-i class="fa-lg" icon="play" />
            </i>
          </span>
        </button>
      </div>
    </div>
    <div
      v-for="d in preset.devices"
      :key="`${d.type}|${d.id}`"
      class="devices-grid"
    >
      <!-- <span class="order" v-text="preset.setorder[d.id] || '='" /> -->
      <span class="device-path" v-text="getDevName(d)" />
      <span class="device-value" v-text="d.value" />
    </div>
  </article>
</template>

<script>
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import cronstrue from 'cronstrue/i18n'
import ButtonEdit from '../components/ButtonEdit'

export default {
  inject: ['getDevName'],
  components: { ButtonEdit },
  mixins: [i18SelectMixin],
  props: { preset: { type: Object, required: true } },
  computed: {
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
      return !this.preset.active ? 'Määra aeg' : ''
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

<style lang="scss">
.preset-item {
  margin-bottom: 3rem;
  display: grid;
  gap: 0.75rem;
  grid-template-areas:
    'name name'
    'schd cmmd';
  grid-template-columns: 15rem 12rem;
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
    // grid-column: 1 / 4;
    grid-column: 1 / 3;
    display: grid;
    gap: 0.2rem;
    grid-auto-flow: column;
    grid-template-columns: /* 2rem */ 12.5rem 1fr;
    grid-auto-rows: 1fr;
  }
}
</style>

<style lang="scss" scoped>
.switch-container {
  padding-top: 0.225rem;
}
</style>
