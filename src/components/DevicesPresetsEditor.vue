<template>
  <div
    id="devicesPresetEditor"
    class="modal"
    tabindex="0"
    ref="root"
    @keyup.stop.esc="$emit('quit')"
    @keyup.stop.enter="$emit('save', preset)"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="control">
        <button class="modal-close is-large" aria-label="close" @click="$emit('quit')"/>
      </div>
      <section class="steps">
        <!-- render all steps based on viewmodel data -->
        <div class="step-item" v-for="s in s_steps" :key="s.id">
          <div class="step-marker">
            <span class="text" v-text="s.id"/>
            <span class="icon">
              <f-a :icon="s.icon"/>
            </span>
          </div>
          <div class="step-details">
            <p class="step-title" v-text="s.title"/>
            <p v-text="s.description"/>
          </div>
        </div>
        <!-- render step contents -->
        <section class="steps-content">
          <step1 class="step-content" :preset.sync="preset"/>
          <step2 class="step-content" :preset.sync="preset"/>
          <step3 class="step-content" :preset.sync="preset"/>
          <step4 class="step-content" :preset.sync="preset"/>
        </section>
        <!-- render step actions/buttons -->
        <section class="steps-actions">
          <div class="steps-action">
            <button class="button is-outlined is-success" @click="$emit('save', preset)">
              <span class="icon">
                <f-a icon="check"/>
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="previous">
              <span class="icon">
                <f-a icon="chevron-left"/>
              </span>
            </button>
          </div>
          <div class="steps-action">
            <button class="button is-outlined is-light" data-nav="next">
              <span class="icon">
                <f-a icon="chevron-right"/>
              </span>
            </button>
          </div>
        </section>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="$emit('quit')"/>
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
    presetForEdit: { type: Object, required: true },
    devices: { type: Array, required: true }
  },
  data() {
    return {
      preset: { ...this.presetForEdit }
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
          description:
            'Vali seadmed ja nende olekud, millesse need määratud ajal seadmed pannakse.',
          icon: 'check'
        },
        {
          id: 3,
          title: 'Järjestus',
          description: 'Vali, millises järjekorras seadmed käivitatakse.',
          icon: 'flag'
        }
      ]
    }
  },
  mounted() {
    let stepsElement = document.querySelector(
      `.steps[${this.$options._scopeId}]`
    )
    let contentsElements = stepsElement.querySelectorAll(
      '.steps-content>.step-content'
    )

    /**
     * Manipulate focus of some element in modal to caputer ESC key event.
     * @param stepId 0-based index of .step-item element; they allign with .step-content elements.
     */
    function showHandler(stepId) {
      if (!contentsElements[stepId]) {
        return
      }
      let anyControl = contentsElements[stepId].querySelector(
        'input[type="text"], button, input'
      )
      if (anyControl) {
        anyControl.focus()
      } else {
        // Optionally could set focus to step elements as well if they are clickables
        this.$refs.root.focus()
      }
    }
    new BulmaSteps(stepsElement, {
      // stepClickable: true, // experimenting, source has this option
      /* need to add Vue instance as a context to handler */
      onShow: showHandler.bind(this)
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
