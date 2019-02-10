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
              ref="focus"
              v-model.lazy.trim="preset.name"
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
export default {
  props: { preset: { type: Object, required: true } },
  static() {
    return { s_placeholder1: 'sisesta tekst' }
  }
}
</script>
