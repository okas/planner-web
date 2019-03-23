<template functional>
  <a
    role="button"
    class="cancel button"
    :class="[data.class, data.staticClass]"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <i class="icon">
      <fa-i class="fa-lg" icon="times" />
    </i>
  </a>
</template>
