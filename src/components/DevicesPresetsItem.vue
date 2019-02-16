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
          <fa-i icon="times" />
        </button>
      </div>
      <div class="control">
        <button
          class="button is-small is-outlined is-light"
          title="Muuda automaattoiming"
          @click="$emit('modify', preset)"
        >
          <span class="icon">
            <fa-i icon="cog" />
          </span>
        </button>
      </div>
      <div class="control">
        <button class="button is-small is-outlined is-light">
          <span class="icon">
            <fa-i icon="play" />
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
import cronstrue from 'cronstrue'

export default {
  inject: ['getDevName'],
  props: { preset: { type: Object, required: true } },
  computed: {
    cronDescription() {
      return cronstrue.toString(this.preset.schedule)
    },
    disableSetActive() {
      return !this.preset.schedule && !this.$store.state.ioConnected
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
