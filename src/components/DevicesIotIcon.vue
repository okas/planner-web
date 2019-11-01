<template>
  <i class="icon is-medium">
    <fa-l class="fa">
      <fa-i :icon="icon" :class="iconClasses" class="fa-2x" />
      <transition name="fade">
        <fa-i
          v-if="iconEffect"
          class="fa-lg"
          :class="iconEffectClasses"
          :icon="iconEffect"
          transform="right-4"
        />
      </transition>
    </fa-l>
  </i>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    icon: { type: String, required: true },
    iconClasses: { type: String, default: '' },
    iconEffect: { type: String, default: '' },
    iconEffectClasses: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css_fade_transition.scss';
</style>
