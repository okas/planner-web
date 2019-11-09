<template>
  <p v-if="txt" class="help" v-text="txt" />
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    txt: {
      type: String,
      default: ''
    }
  }
}
</script>
