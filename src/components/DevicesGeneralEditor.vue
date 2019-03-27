<template>
  <div
    :id="editorId"
    class="quickview"
    @keyup.stop.esc="quit"
    @keyup.stop.enter="save"
  >
    <header class="quickview-header">
      <slot name="header-title" :_class="'title'" />
      <button class="delete" title="Katkesta" @click="quit" />
    </header>
    <div class="quickview-body">
      <div class="quickview-block">
        <div class="field">
          <label class="label">Nimi</label>
          <div class="control">
            <input
              v-model="device.name"
              v-focus
              class="input"
              type="text"
              placeholder="sisesta nimi"
            />
          </div>
        </div>
        <div class="field">
          <label class="label" for="selectedroom">Ruum</label>
          <div class="control">
            <input
              id="selectedroom"
              v-model="device.room"
              class="input"
              type="text"
              list="existingrooms"
              placeholder="vali või sisesta uus ruum"
            />
          </div>
          <datalist id="existingrooms">
            <option v-for="r in existingrooms" :key="r" :value="r" />
          </datalist>
        </div>
      </div>
    </div>
    <footer class="quickview-footer">
      <div class="field is-grouped">
        <div class="control">
          <button-ok
            class="is-outlined is-success"
            title="Kinnita"
            @click="save"
          />
        </div>
        <div class="control">
          <button
            class="button is-text"
            title="Katkesta"
            @click="quit"
            v-text="canceltext"
          />
        </div>
        <div v-if="showRemoveButton" class="control">
          <button-remove-confirm
            class="is-outlined"
            title="Kustuta"
            @confirm="remove"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { MODE_MODIFY } from '../constants/uiEditorConstants'
import { i18SelectMixin } from '../plugins/vue-i18n-select/'
import { FocusDirectiveMixin } from '../directives/focus'
import ButtonOk from '../components/ButtonOk'
import ButtonRemoveConfirm from '../components/ButtonRemoveConfirm'

export default {
  components: { ButtonOk, ButtonRemoveConfirm },
  mixins: [i18SelectMixin, FocusDirectiveMixin],
  props: {
    mode: { type: String, default: null },
    deviceForEdit: { type: Object, required: true },
    existingrooms: { type: Array, required: true },
    editorId: { type: String, default: 'generalEditor' }
  },
  data() {
    return {
      device: JSON.parse(JSON.stringify(this.deviceForEdit))
    }
  },
  computed: {
    showRemoveButton() {
      return this.mode === MODE_MODIFY
    },
    canceltext() {
      switch (this.$language) {
        case 'et':
          return 'Katkesta'
        case 'es':
          return 'Canclear'
        default:
          return 'Cancel'
      }
    }
  },
  methods: {
    quit() {
      this.$emit('quit')
    },
    remove() {
      this.$emit('remove')
    },
    save() {
      this.$emit('save', this.device)
    }
  }
}
</script>
