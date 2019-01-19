<template>
  <div
    id="devicesPresetEditor"
    class="modal"
    tabindex="0"
    ref="root"
    @keyup.stop.esc="$emit('quit')"
    @keyup.stop.enter="$emit('save', p)"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="control">
        <button class="modal-close is-large" aria-label="close" @click="$emit('quit')"/>
      </div>
      <section class="steps">
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
          <div class="step-content has-text-centered">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label has-text-grey">Nimi</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" type="text" placeholder="Text input" v-model="p.name">
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label has-text-grey">Ajastus</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" type="text" placeholder="Text input" v-model="p.schedule">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="step-content has-text-centered">Sisu 2</div>
          <div class="step-content has-text-centered">Sisu 3</div>
        </section>
        <!-- render step actions/buttons -->
        <section class="steps-actions">
          <div class="steps-action">
            <button class="button is-outlined is-success" @click="$emit('save', p)">
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
  </div>
</template>

<script>
import BulmaSteps from 'bulma-extensions/bulma-steps/src/js'

export default {
  props: { preset: { type: Object, required: true } },
  data() {
    return {
      p: { ...this.preset }
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
