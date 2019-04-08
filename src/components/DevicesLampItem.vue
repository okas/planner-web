<template>
  <div class="lamp box is-marginless">
    <h4 class="lamp-name is-size-6" v-text="lamp.name" />
    <fa-i
      class="lamp-icon fa-2x"
      icon="lightbulb"
      :class="{ 'has-text-warning': !!lamp.state }"
    />
    <div class="switch-container">
      <input
        :id="`l${lamp.id}`"
        v-model="lamp.state"
        class="switch is-thin is-rounded"
        type="checkbox"
        :true-value="1"
        :false-value="0"
      />
      <label class="switch-label" :for="`l${lamp.id}`" />
      <button-edit
        title="Muuda lampi"
        class="is-small is-text"
        @click="modify"
      />
    </div>
  </div>
</template>

<script>
import ButtonEdit from '../components/ButtonEdit'

export default {
  components: { ButtonEdit },
  props: { lamp: { type: Object, required: true } },
  methods: {
    modify() {
      this.$emit('openEditor', this.lamp.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices_lamps.scss';

.edit:hover {
  color: initial;
  background-color: initial;
}

.lamp {
  display: grid;
  grid-column-gap: 5%;
  grid-row-gap: 0.25rem;
  grid-template-areas:
    'n n'
    'i s';
  grid-template-columns: 35% 60%;
  justify-content: center;
  &.box {
    width: $lamp-width;
    height: $lamp-height;
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
