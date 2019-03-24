<template functional>
  <component
    :is="prop.tag"
    role="button"
    class="cancel button"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="times" />
    </i>
  </component>
</template>

<script>
export default { props: { tag: { type: String, default: 'a' } } }
</script>
