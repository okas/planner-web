<template>
  <div class="remote">
    <div class="box">
      <h4 class="subtitle is-4 has-text-centered">Aken</h4>
      <div class="controls">
        <button class="button up">
          <f-a icon="chevron-up"/>
        </button>
        <button class="button stop">
          <f-a :icon="['far', 'square']"/>
        </button>
        <button class="button down">
          <f-a icon="chevron-down"/>
        </button>
        <div class="slider-wrapper">
          <div class="wrap-helper">
            <input
              class="slider is-large is-circle"
              step="1"
              min="0"
              max="100"
              value="50"
              type="range"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.remote {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .controls {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(2, 40px);
    grid-template-rows: repeat(3, 36px);
    grid-row-gap: 18px;
    grid-template-areas:
      'up sl'
      'st sl'
      'dn sl';
    .button.up {
      grid-area: up;
    }
    .button.stop {
      grid-area: st;
    }
    .button.down {
      grid-area: dn;
    }
    .slider-wrapper {
      grid-area: sl;
      .wrap-helper {
        display: inline-block;
        width: 1px;
        height: 144px;
        padding: 0;
        .slider {
          width: 144px;
          height: 1px;
          margin: 0;
          transform-origin: 68px 76px;
          transform: rotate(-90deg);
        }
      }
    }
  }
}
</style>
