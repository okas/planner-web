<template>
  <div class="step-naming has-text-centered">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label has-text-grey">Nimi</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              v-model.lazy.trim="preset.name"
              v-focus="isActive"
              class="input"
              type="text"
              :placeholder="s_placeholder1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FocusDirectiveMixin } from '../directives/focus'

export default {
  mixins: [FocusDirectiveMixin],
  props: {
    preset: { type: Object, required: true },
    isActive: { type: Boolean }
  },
  static() {
    return { s_placeholder1: 'sisesta tekst' }
  }
}
</script>
