<template>
  <div class="blind-remote grid box is-marginless">
    <h4 class="remote-label is-size-5 has-text-centered" v-text="blind.name" />
    <div class="remote-manage">
      <button-edit
        title="Muuda rulood"
        class="is-small is-text"
        @click="modify"
      />
    </div>
    <button class="up button is-medium">
      <fa-i icon="chevron-up" />
    </button>
    <button class="stop button is-medium">
      <fa-i :icon="['far', 'square']" />
    </button>
    <button class="down button is-medium">
      <fa-i icon="chevron-down" />
    </button>
    <div class="slider-wrapper">
      <div class="helper">
        <input
          v-model.number="blind.state"
          type="range"
          class="slider is-large is-circle"
          step="0.01"
          min="0"
          max="1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonEdit from '../components/ButtonEdit'

export default {
  components: { ButtonEdit },
  props: { blind: { type: Object, required: true } },
  methods: {
    modify() {
      this.$emit('modify')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices-blinds.scss';

$slider-height: $remote-row-gap * 2 + $button-height * 3;
// Following 3 lines calculate transform-origin values related to slider height
$origin-offset: 5px;
$x-origin: ($slider-height / 2 - $origin-offset);
$y-origin: ($slider-height / 2 + $origin-offset);

.blind-remote.grid {
  display: grid;
  justify-content: center;
  justify-items: center;
  grid-template-columns: repeat(2, $button-width);
  grid-template-rows: 2rem repeat(3, $button-height);
  grid-column-gap: $remote-col-gap;
  grid-row-gap: $remote-row-gap;
  grid-template-areas:
    'lb lb'
    'mg mg'
    'up sl'
    'st sl'
    'dn sl';
  &.box {
    width: $remote-width;
    height: $remote-height;
  }
  .remote-label {
    grid-area: lb;
    align-self: center;
  }
  .remote-manage {
    grid-area: mg;
    align-self: center;
  }
  .up {
    grid-area: up;
  }
  .stop {
    grid-area: st;
  }
  .down {
    grid-area: dn;
  }
  .slider-wrapper {
    grid-area: sl;
    .helper {
      display: inline-block;
      width: 1px;
      height: $slider-height;
      padding: 0;
      .slider {
        width: $slider-height;
        height: 1px;
        margin: 0;
        transform-origin: $x-origin $y-origin;
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
