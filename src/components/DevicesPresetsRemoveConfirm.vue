<template>
  <div class="modal remove-confirm" tabindex="0" @keyup.stop.esc="quit">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h3 class="title is-3 has-text-danger">Kinnita tegevuse kustutamine</h3>
      <h4 class="title has-text-weight-light is-4" v-text="presetName" />
      <button
        ref="focus"
        class="button is-outlined is-warning"
        @click="confirm"
      >
        <span>Kustutan</span>
        <span class="icon is-small">
          <fa-i icon="times" />
        </span>
      </button>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="quit"
    ></button>
  </div>
</template>

<script>
export default {
  props: { presetName: { type: String, required: true } },
  mounted() {
    this.$refs.focus.focus()
  },
  methods: {
    quit() {
      this.$emit('quit')
    },
    confirm() {
      this.$emit('remove')
    }
  }
}
</script>
