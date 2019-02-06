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
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label has-text-grey">Aktiivne</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control switch-container">
            <input
              id="editorSetAct"
              v-model.lazy.trim="preset.active"
              class="switch is-outlined"
              type="checkbox"
            />
            <label for="editorSetAct" />
          </div>
        </div>
        <div class="field-label is-normal">
          <label class="label has-text-grey">Ajastus</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                v-model.lazy.trim="preset.schedule"
                class="input"
                type="text"
              />
            </div>
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

<style lang="scss" scoped>
.switch-container {
  padding-top: 0.6rem;
}
</style>
