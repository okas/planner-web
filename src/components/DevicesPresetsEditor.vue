<template>
  <div
    id="devicesPresetEditor"
    ref="root"
    class="modal"
    tabindex="0"
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
            <button class="button is-outlined is-success" @click="save">
              <span class="icon">
                <fa-i icon="check" />
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="previous">
              <span class="icon">
                <fa-i icon="chevron-left" />
              </span>
            </button>
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
          <step1 ref="step1" class="step-content" :preset="preset" />
          <step2
            ref="step2"
            class="step-content"
            :devices="preset.devices"
            :device-selection="deviceSelection"
            @reloadDeviceSelection="ioGetDeviceSelection"
            @saveSelectedDevices="saveSelectedDevices"
          />
          <step3
            ref="step3"
            class="step-content"
            :devices="preset.devices"
            :device-selection="deviceSelection"
          />
          <step4 ref="step4" class="step-content" :preset.sync="preset" />
        </section>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="quit" />
  </div>
</template>

<script>
import BulmaSteps from 'bulma-extensions/bulma-steps/src/js'
import Step1 from './DevicesPresetsEditorStep1Content'
import Step2 from './DevicesPresetsEditorStep2Content'
import Step3 from './DevicesPresetsEditorStep3Content'
import Step4 from './DevicesPresetsEditorStep4Content'

export default {
  components: { Step1, Step2, Step3, Step4 },
  props: {
    presetForEdit: { type: Object, required: true }
  },
  data() {
    return {
      preset: JSON.parse(JSON.stringify(this.presetForEdit)),
      deviceSelection: []
    }
  },
  static() {
    return {
      s_steps: [
        {
          id: 1,
          title: 'Nimetus',
          description: 'Määra nimi ja millal seadmeid juhtima hakatakse.',
          icon: 'check'
        },
        {
          id: 2,
          title: 'Seadmed',
          description: 'Vali välja sedmed, mida on vaja juhtida.',
          icon: 'check'
        },
        {
          id: 3,
          title: 'Olekud',
          description:
            'Määra seadmetele olek, millesse need käivitusel pannakse.',
          icon: 'check'
        },
        {
          id: 4,
          title: 'Järjestus',
          description: 'Vali, millises järjekorras seadmed käivitatakse.',
          icon: 'flag'
        }
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
  created() {
    this.ioGetDeviceSelection()
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
    stepShowHandler(stepId) {
      /**
       * @param stepId 0-based index of .step-item element; they allign with .step-content elements.
       */
      try {
        this.$refs[`step${stepId + 1}`].$refs.focus.focus()
      } catch {
        /* If no focusable ref found on step content, then focus current modal. */
        this.$refs.root.focus()
      }
    },
    ioGetDeviceSelection() {
      this.$socket.emit(
        'presets-get-devices-selection',
        this.$language,
        data => (this.deviceSelection = data)
      )
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
.step-item:last-of-type.is-active .step-marker {
  color: $success;
  border-color: $success;
}
.step-item:last-of-type.is-active .step-marker .icon {
  display: inherit;
}
</style>
