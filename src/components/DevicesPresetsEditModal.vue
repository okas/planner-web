<template>
  <div class="modal" tabindex="0" ref="esc" @keyup.stop.esc="$emit('quit')">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" v-model="p.name">
        </div>
      </div>
      <div class="field">
        <label class="label">Schedule</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" v-model="p.schedule">
        </div>
      </div>
    </div>
    <button class="button is-primary" @click="$emit('save', p)">Save</button>
    <button class="modal-close is-large" aria-label="close" @click="$emit('quit')"></button>
  </div>
</template>

<script>
export default {
  props: { preset: { type: Object, required: true } },
  data() {
    return {
      p: { ...this.preset }
    }
  },
  mounted() {
    // Additional to HTML element focusing, you need to add [tabindex]
    // as well to it to get keypress working on non-control elements!
    this.$refs.esc.focus()
  }
}
</script>
