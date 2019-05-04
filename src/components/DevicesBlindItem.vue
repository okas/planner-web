<template>
  <div class="blind grid box is-marginless" :title="blind.id">
    <h4 class="blind-label is-size-5 has-text-centered" v-text="blind.name" />
    <div class="blind-manage">
      <i class="blind-icon icon" :title="iconTitle">
        <transition name="fade">
          <fa-i v-if="isOffline" class="fa-lg has-text-danger" icon="ban" />
        </transition>
      </i>
      <button-edit
        title="Muuda rulood"
        class="is-small is-text"
        @click="modify"
      />
    </div>
    <button class="up button is-medium" :disabled="isOffline">
      <fa-i icon="chevron-up" />
    </button>
    <button class="stop button is-medium" :disabled="isOffline">
      <fa-i :icon="['far', 'square']" />
    </button>
    <button class="down button is-medium" :disabled="isOffline">
      <fa-i icon="chevron-down" />
    </button>
    <div class="slider-wrapper">
      <div class="helper">
        <input
          v-model.number="blind.state"
          :disabled="isOffline"
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
import { disabled } from '../mixins/ioNotConnected'
import ButtonEdit from '../components/ButtonEdit'

export default {
  components: { ButtonEdit },
  mixins: [disabled],
  props: { blind: { type: Object, required: true } },
  computed: {
    isOffline() {
      return (
        this.disabled ||
        this.blind.state === undefined ||
        this.blind.state === null
      )
    },
    iconTitle() {
      return this.disabled
        ? 'Puudub ühendus serveriga'
        : this.isOffline
        ? 'Rulooga puudub võrguühendus'
        : ''
    }
  },
  methods: {
    changeBlindState() {
      this.$emit(
        'blindStateChanged',
        this.blind.id,
        this.blind.state === 0 ? 1 : 0
      )
    },
    modify() {
      this.$emit('openEditor', this.blind.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices-blinds.scss';

$slider-height: $blind-row-gap * 2 + $button-height * 3;
// Following 3 lines calculate transform-origin values related to slider height
$origin-offset: 5px;
$x-origin: ($slider-height / 2 - $origin-offset);
$y-origin: ($slider-height / 2 + $origin-offset);

.blind.grid {
  display: grid;
  justify-content: center;
  justify-items: center;
  grid-template-columns: repeat(2, $button-width);
  grid-template-rows: 2rem repeat(3, $button-height);
  grid-column-gap: $blind-col-gap;
  grid-row-gap: $blind-row-gap;
  grid-template-areas:
    'lb lb'
    'mg mg'
    'up sl'
    'st sl'
    'dn sl';
  &.box {
    width: $blind-width;
    height: $blind-height;
  }
  .blind-label {
    grid-area: lb;
    align-self: center;
  }
  .blind-manage {
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
