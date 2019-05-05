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
          :disabled="disableControls"
          :ask-timeout="askTimeout"
          @change="removeHandler"
        />
      </div>
      <div class="control">
        <button-edit
          title="Muuda automaattoiming"
          class="is-small is-outlined is-light"
          :disabled="disableControls"
          @click="modifyHandler"
        />
      </div>
      <div class="control">
        <button
          class="button is-small is-outlined is-light"
          :disabled="disableTaksRunControl"
          @click="taskRunControlHandler"
        >
          <i class="icon">
            <fa-i
              class="fa-lg"
              :class="
                taskRunState === $options.TASK_RUNNING
                  ? 'fa-spin has-text-info'
                  : ''
              "
              :icon="taskRunIcon"
            />
          </i>
        </button>
      </div>
    </div>
    <section class="devices">
      <device v-for="d in devices" :key="`${d.type}.${d.id}`" :device="d">
        <transition slot="task-state" name="fade">
          <fa-i
            v-if="showDevicePresence"
            :class="d.preset ? 'has-text-success' : 'has-text-danger'"
            :icon="d.preset ? 'check' : 'ban'"
          />
        </transition>
      </device>
    </section>
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
      askTimeout: 5000,
      disableControls: false,
      taskRunState: this.$options.TASK_CLEARED,
      showDevicePresence: false,
      showTaskWaitTimeout: null
    }
  },
  TASK_CLEARED: Symbol('taskCleared'),
  TASK_RUNNING: Symbol('taskRunning'),
  TASK_DONE: Symbol('taskDone'),
  computed: {
    taskRunIcon() {
      switch (this.taskRunState) {
        case this.$options.TASK_CLEARED:
          return 'play'
        case this.$options.TASK_RUNNING:
          return 'spinner'
        case this.$options.TASK_DONE:
          return 'pause'
        default:
          return ''
      }
    },
    devices() {
      if (!this.preset || !this.preset.devices) {
        return []
      }
      return this.preset.devices.map(pd => ({
        ...pd,
        name: this.getDevName(pd, true),
        present: null
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
        !this.preset.schedule ||
        this.preset.devices.length < 1 ||
        this.disabled ||
        this.disableControls
      )
    },
    disableTaksRunControl() {
      return this.disabled || this.disableControls
    },
    activeTitle() {
      // ToDo i18n
      return !this.preset.active ? 'Määra aeg' : ''
    },
    hasMissingDevices() {
      return this.devices.some(d => !d.name)
    }
  },
  beforeDestroy() {
    clearTimeout(this.showTaskWaitTimeout)
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
    taskRunControlHandler() {
      if (this.taskRunState === this.$options.TASK_CLEARED) {
        this.disableControls = true
        this.taskRunState = this.$options.TASK_RUNNING
        this.$emit('runPresetTask', this.preset.id, this.taskDone)
        this.showTaskWaitTimeout = setTimeout(this.resetPresetTaskStates, 6000)
      } else if (this.taskRunState === this.$options.TASK_DONE) {
        this.resetTaskState()
      }
    },
    taskDone(timeoutReached, responseDevices) {
      clearTimeout(this.showTaskWaitTimeout)
      responseDevices.forEach(rd => {
        this.devices.find(
          d => d.id === rd.id && d.type === rd.type
        ).preset = true
      })
      this.taskRunState = this.$options.TASK_DONE
      this.showDevicePresence = true
      this.disableControls = false
    },
    resetTaskState() {
      this.devices.forEach(d => (d.preset = null))
      this.resetPresetTaskStates()
    },
    resetPresetTaskStates() {
      this.disableControls = false
      this.taskRunState = this.$options.TASK_CLEARED
      this.showDevicePresence = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css_fade_transition.scss';

.preset-item {
  margin-bottom: 3rem;
  display: grid;
  gap: 0.75rem;
  grid-template-areas:
    'name name'
    'schd cmmd'
    'devs devs';
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
  .devices {
    grid-area: devs;
  }
}
</style>
