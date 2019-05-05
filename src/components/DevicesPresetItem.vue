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
          :id="`act${preset.id}`"
          :checked="preset.active"
          class="switch is-outlined"
          type="checkbox"
          :name="`act${preset.id}`"
          :disabled="disableSetActive"
          @click.prevent.stop="saveActiveState"
        />
        <label :for="`act${preset.id}`" />
      </div>
      <div class="control">
        <button-remove-confirm
          class="is-small is-outlined"
          default-state-class="is-light"
          title="Kustuta automaattoiming"
          :ask-timeout="askTimeout"
          @change="removeHandler"
        />
      </div>
      <div class="control">
        <button-edit
          title="Muuda automaattoiming"
          class="is-small is-outlined is-light"
          @click="modifyHandler"
        />
      </div>
      <div class="control">
        <button
          class="button is-small is-outlined is-light"
          @click="runPresetTask"
        >
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
import { disabled } from '../mixins/ioNotConnected'
import cronstrue from 'cronstrue/i18n'
import ButtonEdit from '../components/ButtonEdit'
import ButtonRemoveConfirm from '../components/ButtonRemoveConfirm'
import Device from '../components/DevicesPresetItemDevice'

export default {
  components: { ButtonRemoveConfirm, ButtonEdit, Device },
  mixins: [i18SelectMixin, disabled],
  inject: ['getDevName'],
  props: { preset: { type: Object, required: true } },
  data() {
    return {
      askTimeout: 5000
    }
  },
  computed: {
    devices() {
      if (!this.preset || !this.preset.devices) {
        return []
      }
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
      return (
        !this.preset.schedule || this.preset.devices.length < 1 || this.disabled
      )
    },
    activeTitle() {
      // ToDo i18n
      return !this.preset.active ? 'Määra aeg' : ''
    },
    hasMissingDevices() {
      return this.devices.some(d => !d.name)
    }
  },
  methods: {
    modifyHandler() {
      this.$emit('modify', this.preset)
    },
    saveActiveState(event) {
      this.$emit('setActive', this.preset, event.target.checked)
    },
    removeHandler(newState) {
      if (!newState) {
        this.$emit('remove', this.preset.id)
      }
    },
    runPresetTask() {
      this.$emit('runPresetTask', this.preset.id)
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
