<template>
  <div class="blind-remote box">
    <div class="grid">
      <h4 class="remote-label is-size-5 has-text-centered" v-text="blind.name"/>
      <button class="up button is-medium">
        <f-a icon="chevron-up"/>
      </button>
      <button class="stop button is-medium">
        <f-a :icon="['far', 'square']"/>
      </button>
      <button class="down button is-medium">
        <f-a icon="chevron-down"/>
      </button>
      <div class="slider-wrapper">
        <div class="helper">
          <input
            type="range"
            class="slider is-large is-circle"
            step="0.01"
            min="0"
            max="1"
            :value="blind.state"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { blind: { type: Object, required: true } }
}
</script>

<style lang="scss" scoped>
$col-gap: 10px;
$row-gap: 22.5px;
$button-height: 45px;
$button-width: 49.5px;
$slider-height: $row-gap * 2 + $button-height * 3;
// Following 3 lines calculate transform-origin values related to slider height
$origin-offset: 5px;
$x-origin: ($slider-height / 2 - $origin-offset);
$y-origin: ($slider-height / 2 + $origin-offset);

.blind-remote {
  display: inline-flex;
  justify-content: center;
  .grid {
    display: grid;
    justify-content: center;
    justify-items: center;
    grid-template-columns: repeat(2, $button-width);
    grid-template-rows: 2rem repeat(3, $button-height);
    grid-column-gap: $col-gap;
    grid-row-gap: $row-gap;
    grid-template-areas:
      'lb lb'
      'up sl'
      'st sl'
      'dn sl';
    .remote-label {
      grid-area: lb;
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
}
</style>
