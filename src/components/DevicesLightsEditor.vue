<template>
  <div id="quickviewLamp" class="quickview">
    <header class="quickview-header">
      <slot name="header-title" :_class="'title'" />
      <span class="delete" data-dismiss="quickview" @click="quit" />
    </header>
    <div class="quickview-body">
      <div class="quickview-block">
        <div class="field">
          <label class="label">Nimi</label>
          <div class="control">
            <input
              v-model="lampForEdit.name"
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
              v-model="lampForEdit.room"
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
          <button
            class="button is-outlined is-success"
            data-dismiss="quickview"
            @click="save"
          >
            <span class="icon">
              <fa-i icon="check" />
            </span>
          </button>
        </div>
        <div class="control">
          <button class="button is-text" data-dismiss="quickview" @click="quit">
            Cancel
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    lampForEdit: { type: Object, required: true },
    existingrooms: { type: Array, required: true }
  },
  methods: {
    quit() {
      this.$emit('quit')
    },
    save() {
      this.$emit('save', this.lampForEdit)
    }
  }
}
</script>

<style lang="scss"></style>
