<template>
  <div class="vue-i18n-select control has-icons-left">
    <div class="select is-small is-rounded">
      <select v-model="$language">
        <option v-for="language in $languages" :key="language" :value="language" v-text="language"/>
      </select>
    </div>
    <span class="icon is-left">
      <fa-i :icon="icon"/>
    </span>
  </div>
</template>

<script>
import i18SelectMixin from './mixin'

export default {
  mixins: [i18SelectMixin],
  props: { icon: { type: [String, Array], default: 'globe' } }
}
</script>

<style lang="scss">
.vue-i18n-select .select select {
  background-color: hsl(45, 3%, 45%);
  border: $header-footer-border;
  color: $special2;
}
</style>
