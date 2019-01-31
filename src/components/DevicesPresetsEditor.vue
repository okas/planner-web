<template>
  <div
    id="devicesPresetEditor"
    class="modal"
    tabindex="0"
    ref="root"
    @keyup.stop.esc="quit"
    @keyup.stop.enter="save"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <header class="component-header has-text-centered">
        <slot name="header-title" :_class="'has-text-danger'"/>
      </header>
      <section class="steps" ref="stepsContainer">
        <!-- render all steps based on viewmodel data -->
        <div class="step-item" v-for="s in s_steps" :key="s.id">
          <div class="step-marker">
            <span class="text" v-text="s.id"/>
            <span class="icon">
              <fa-i :icon="s.icon"/>
            </span>
          </div>
          <div class="step-details">
            <p class="step-title" v-text="s.title"/>
            <p v-text="s.description"/>
          </div>
        </div>
        <!-- render step actions/buttons -->
        <section class="steps-actions">
          <div class="steps-action">
            <button class="button is-outlined is-success" @click="save">
              <span class="icon">
                <fa-i icon="check"/>
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="previous">
              <span class="icon">
                <fa-i icon="chevron-left"/>
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="next">
              <span class="icon">
                <fa-i icon="chevron-right"/>
              </span>
            </button>
          </div>
        </section>
        <!-- render step contents -->
        <section class="steps-content">
          <step1 class="step-content" ref="step1" :preset.sync="preset"/>
          <step2
            class="step-content"
            ref="step2"
            :preset.sync="preset"
            :device-selection="deviceSelection"
            :selected-devices="devicesGroupbyType"
            @refreshDevices="ioGetDeviceSelection"
          />
          <step3 class="step-content" ref="step3" :preset.sync="preset"/>
          <step4 class="step-content" ref="step4" :preset.sync="preset"/>
        </section>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="quit"/>
  </div>
</template>

<script>
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import BulmaSteps from 'bulma-extensions/bulma-steps/src/js'
import Step1 from './DevicesPresetsEditorStep1Content'
import Step2 from './DevicesPresetsEditorStep2Content'
import Step3 from './DevicesPresetsEditorStep3Content'
import Step4 from './DevicesPresetsEditorStep4Content'

export default {
  mixins: [i18SelectMixin],
  components: { Step1, Step2, Step3, Step4 },
  props: {
    presetForEdit: { type: Object, required: true }
  },
  data() {
    return {
      preset: {
        /* this way internal state of editor is isolated from parent model changes */
        ...this.presetForEdit
      },
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
  computed: {
    devicesGroupbyType: {
      get() {
        return this.preset.devices.reduce((groupS, { type, id }) => {
          const g = groupS[type] || (groupS[type] = [])
          g.push(id)
          return groupS
        }, {})
      }
    }
  },
  methods: {
    save() {
      this.saveSelectedDevices()
      this.$emit('save', this.preset)
    },
    quit() {
      this.$emit('quit')
    },
    saveSelectedDevices() {
      const deviceGroups = Object.entries(this.devicesGroupbyType)
      const presetDevices = deviceGroups.reduce((acc, [type, ids]) => {
        const devGroup = this.deviceSelection.find(g => g.type === type)
        const flatDevicesWithRooms = devGroup.items.reduce(
          (a, { id: room, items: devices }) => {
            const devWithRoom = devices.map(d => {
              return { ...d, room }
            })
            return a.concat(devWithRoom)
          },
          []
        )
        const devices = ids.map(id => {
          const device = flatDevicesWithRooms.find(d => d.id == id)
          return {
            id,
            type,
            value: 0.55,
            name: `${device.name} / ${device.room}`
          }
        })
        return acc.concat(devices)
      }, [])
      this.preset.devices = presetDevices
    },
    ioGetDeviceSelection() {
      this.$socket.emit(
        'presets-get-devices-selection',
        this.$language,
        data => (this.deviceSelection = data)
      )
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
    }
  },
  created() {
    this.ioGetDeviceSelection()
  },
  mounted() {
    new BulmaSteps(this.$refs.stepsContainer, {
      // stepClickable: true, // experimenting, source has this option
      /* need to add Vue instance as a context to handler */
      onShow: this.stepShowHandler.bind(this)
    })
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
