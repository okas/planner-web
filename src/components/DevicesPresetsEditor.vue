<template>
  <div
    id="devicesPresetEditor"
    class="modal"
    @keyup.stop.esc="quit"
    @keyup.stop.enter="save"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <header class="component-header has-text-centered">
        <slot name="header-title" :_class="'has-text-danger'" />
      </header>
      <section ref="stepsContainer" class="steps">
        <!-- render all steps based on viewmodel data -->
        <div v-for="s in s_steps" :key="s.id" class="step-item">
          <div class="step-marker">
            <span class="text" v-text="s.id" />
            <span class="icon">
              <fa-i :icon="s.icon" />
            </span>
          </div>
          <div class="step-details">
            <p class="step-title" v-text="s.title" />
            <p v-text="s.description" />
          </div>
        </div>
        <!-- render step actions/buttons -->
        <section class="steps-actions">
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="previous">
              <span class="icon">
                <fa-i icon="chevron-left" />
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button-ok class="is-outlined is-success" @click="save" />
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="next">
              <span class="icon">
                <fa-i icon="chevron-right" />
              </span>
            </button>
          </div>
        </section>
        <!-- render step contents -->
        <section class="steps-content">
          <naming
            class="step-content"
            :preset="preset"
            :is-active="0 === currentStep"
          />
          <schedule
            class="step-content"
            :preset="preset"
            :is-active="1 === currentStep"
          />
          <selection
            class="step-content"
            :devices="preset.devices"
            :is-active="2 === currentStep"
            @saveSelectedDevices="saveSelectedDevices"
          />
          <states
            class="step-content"
            :devices="preset.devices"
            :is-active="3 === currentStep"
          />
          <!-- <step4 class="step-content" :preset.sync="preset" /> -->
        </section>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="quit" />
  </div>
</template>

<script>
import BulmaSteps from 'bulma-extensions/bulma-steps/src/js'
import ButtonOk from '../components/ButtonOk'
import Naming from './DevicesPresetsEditorNaming'
import Schedule from './DevicesPresetsEditorSchedule'
import Selection from './DevicesPresetsEditorSelection'
import States from './DevicesPresetsEditorStates'
// import Step4 from './DevicesPresetsEditorStep4Content'

export default {
  components: { ButtonOk, Naming, Schedule, Selection, States /* Step4 */ },
  props: {
    presetForEdit: { type: Object, required: true }
  },
  data() {
    return {
      preset: JSON.parse(JSON.stringify(this.presetForEdit)),
      currentStep: 0
    }
  },
  static() {
    return {
      s_steps: [
        {
          id: 1,
          title: 'Nimetus',
          description: 'Määra automaadi nimi.',
          icon: 'check'
        },
        {
          id: 2,
          title: 'Ajastus',
          description: 'Määra automaatse käivituse aeg.',
          icon: 'check'
        },
        {
          id: 3,
          title: 'Seadmed',
          description: 'Vali välja juhitavad seadmed.',
          icon: 'check'
        },
        {
          id: 4,
          title: 'Olekud',
          description: 'Määra seadmetele olekud tegevuse lõpuks.',
          icon: 'flag'
        }
        // {
        //   id: 4,
        //   title: 'Järjestus',
        //   description: 'Vali, millises järjekorras seadmed käivitatakse.',
        //   icon: 'flag'
        // }
      ]
    }
  },
  mounted() {
    new BulmaSteps(this.$refs.stepsContainer, {
      // stepClickable: true, // experimenting, source has this option
      /* need to add Vue instance as a context to handler */
      onShow: this.stepShowHandler.bind(this)
    })
  },
  methods: {
    save() {
      this.$emit('save', this.preset)
    },
    quit() {
      this.$emit('quit')
    },
    saveSelectedDevices(newDevicesGrouped) {
      this.preset.devices = newDevicesGrouped
    },
    /**
     * @param stepId 0-based index of .step-item element; they allign with .step-content elements.
     */
    stepShowHandler(stepId) {
      this.currentStep = stepId
    }
  }
}
</script>

<style lang="scss" scoped>
/* swaps .step-marker content: .text vs .icon */
/* special behavior of last/finish step */
/* remove unusable button */
.step-item.is-completed .step-marker .text,
.step-item:not(.is-completed) .step-marker .icon,
.step-item:last-of-type.is-active .step-marker .text,
.steps-action [data-nav][disabled] {
  display: none;
}
.step-item:last-of-type.is-active .step-marker .icon {
  display: inherit;
}
.step-item.is-active .step-details {
  color: $primary;
}
.step-item:last-of-type.is-active .step-marker .icon {
  color: $success;
}
</style>
