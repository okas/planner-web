<template>
  <div class="lamp box">
    <h4 class="lamp-name is-size-6" v-text="lamp.name"/>
    <f-a class="lamp-icon fa-2x" icon="lightbulb" :class="{'has-text-warning': !!lamp.state}"/>
    <div class="switch-container">
      <input
        class="switch is-thin is-rounded"
        type="checkbox"
        :id="`l${lamp.id}`"
        v-model="lamp.state"
      >
      <label class="switch-label" :for="`l${lamp.id}`"/>
    </div>
  </div>
</template>

<script>
export default {
  props: { lamp: { type: Object, required: true } }
}
</script>

<style  lang="scss" scoped>
.lamp {
  display: grid;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.25rem;
  grid-template-areas:
    'n n'
    'i s';
  grid-template-columns: 37.5% 63.25%;
  justify-content: center;
  &.box {
    padding: 0.75rem;
  }
  .lamp-name {
    grid-area: n;
    justify-self: center;
  }
  .lamp-icon {
    grid-area: i;
    justify-self: end;
  }
  > .switch-container {
    grid-area: s;
    justify-self: start;
    align-self: end;
  }
}
</style>
