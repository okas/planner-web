<template>
  <div class="step-3 has-text-centered">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label has-text-grey">Olekud</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              ref="focus"
              class="input"
              type="text"
              placeholder="--vali seadme olekud"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { props: { preset: { type: Object, required: true } } }
</script>
