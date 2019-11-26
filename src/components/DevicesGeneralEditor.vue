<template>
  <div
    :id="editorId"
    class="quickview"
    tabindex="0"
    @keyup.stop.esc="quit"
    @keyup.stop.enter="save"
  >
    <header class="quickview-header">
      <slot name="header-title" :_class="'title'">
        <h4 class="title has-text-primary" v-text="editorTitle" />
      </slot>
      <button class="delete" title="Katkesta" @click="quit" />
    </header>
    <div class="quickview-body">
      <section class="quickview-block">
        <div class="field">
          <label class="label">Nimi</label>
          <div class="control">
            <input
              v-model.trim="device.name"
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
              v-model.trim="device.room"
              class="input"
              type="text"
              list="existingrooms"
              placeholder="vali või sisesta uus ruum"
            />
          </div>
          <datalist id="existingrooms">
            <option v-for="r in existingRooms" :key="r" :value="r" />
          </datalist>
        </div>
        <div v-if="showIdField" class="field">
          <label class="label">ID</label>
          <div class="control">
            <input
              v-focus
              class="input"
              type="text"
              readonly
              disabled
              :value="device.id"
            />
          </div>
        </div>
      </section>
      <section class="dependents quickview-block">
        <slot v-if="showDependents" name="show-dependents" />
      </section>
    </div>
    <footer class="quickview-footer">
      <div class="field is-grouped">
        <div class="control">
          <button-ok
            class="is-outlined is-success"
            title="Kinnita"
            tag="button"
            @click="save"
          />
        </div>
        <div class="control">
          <button
            class="button is-text"
            :title="quitOrCanceltext"
            @click="quitOrCancelHandler"
            v-text="quitOrCanceltext"
          />
        </div>
        <div v-if="showRemoveButton" class="control">
          <button-confirm-remove
            v-model="showDependents"
            class="is-outlined"
            :title="removeConfirmTitle"
            @change="changeHandler"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { MODE_MODIFY } from '../constants/uiEditorConstants'
import { FocusDirectiveMixin } from '../directives/focus'
import ButtonOk from '../components/ButtonOk'
import ButtonConfirmRemove from '../components/ButtonConfirmAction'

export default {
  components: { ButtonOk, ButtonConfirmRemove },
  mixins: [FocusDirectiveMixin],
  props: {
    mode: { type: String, default: null },
    deviceForEdit: { type: Object, required: true },
    existingRooms: { type: Array, required: true },
    editorId: { type: String, default: 'generalEditor' },
    editorTitle: { type: String, default: 'Editor' }
  },
  data() {
    return {
      device: this.cloneInput(this.deviceForEdit),
      showDependents: false
    }
  },
  computed: {
    showRemoveButton() {
      return this.mode === MODE_MODIFY
    },
    showIdField() {
      return this.mode === MODE_MODIFY
    },
    quitOrCanceltext() {
      return 'Katkesta'
    },
    removeConfirmTitle() {
      return this.showDependents ? 'Kinnita' : 'Kustuta'
    }
  },
  watch: {
    deviceForEdit(newValue, oldValue) {
      if (newValue.id === oldValue.id) {
        return
      }
      // Todo notify the change to user.
      this.showDependents = false
      this.device = this.cloneInput(newValue)
    },
    showDependents(newValue) {
      if (newValue) {
        this.$emit('verifyDependents', this.device.id)
      }
    }
  },
  methods: {
    quitOrCancelHandler() {
      if (this.showDependents) {
        this.showDependents = false
      } else {
        this.quit()
      }
    },
    changeHandler(newState) {
      if (!newState) {
        this.$emit('remove', this.device.id)
      }
    },
    quit() {
      this.$emit('quit')
    },
    save() {
      this.$emit('save', this.device)
    },
    cloneInput(input) {
      return JSON.parse(JSON.stringify(input))
    }
  }
}

export const transitionMixin = {
  isActiveClass: 'is-active',
  tCss: true,
  methods: {
    async tEnter(el) {
      await this.$nextTick()
      el.classList.add(this.$options.isActiveClass)
    },
    tLeave(el) {
      el.classList.remove(this.$options.isActiveClass)
    }
  }
}
</script>

<style lang="scss">
.quickview-block {
  padding: 1rem;
}
</style>
