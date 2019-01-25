<template>
  <div class="i18n-select control has-icons-left">
    <div class="select is-small is-rounded">
      <select v-model="$language">
        <option v-for="language in $languages" :key="language" :value="language" v-text="language"/>
      </select>
    </div>
    <span class="icon is-left">
      <f-a :icon="icon"/>
    </span>
  </div>
</template>

<script>
import { i18Mixin } from './index.js'

export default {
  mixins: [i18Mixin],
  props: { icon: { type: [String, Array], default: 'globe' } }
}
</script>

<style lang="scss">
.i18n-select .select select {
  background-color: hsl(45, 3%, 45%);
  border: $header-footer-border;
  color: $special2;
}
</style>
