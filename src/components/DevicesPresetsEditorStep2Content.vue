<template>
  <div class="step-2 has-text-centered">
    <div class="field">
      <div class="control">
        <a class="button" role="button" :disabled="!$store.state.ioConnected" @click="refresh">
          <f-a icon="sync-alt"/>
        </a>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label has-text-grey">Seadmed</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="--vali seadmed">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { preset: { type: Object, required: true } },
  methods: {
    refresh() {
      this.$emit('refreshDevices')
    }
  }
}
</script>
