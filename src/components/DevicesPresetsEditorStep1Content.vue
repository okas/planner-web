<template>
  <div class="step-1 has-text-centered">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label has-text-grey">Nimi</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              ref="focus"
              :placeholder="s_placeholder1"
              v-model.trim="preset.name"
            >
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
            <input class="input" type="text" v-model.trim="preset.schedule">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  test: 'test',
  props: { preset: { type: Object, required: true } },
  static() {
    return { s_placeholder1: 'sisesta tekst' }
  }
}
</script>
