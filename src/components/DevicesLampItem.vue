<template>
  <div class="lamp box is-marginless">
    <h4 class="lamp-name is-size-6" v-text="lamp.name" />
    <i class="lamp-icon icon" :title="iconTitle">
      <fa-l class="fa-2x">
        <fa-i
          class
          icon="lightbulb"
          :class="{ 'has-text-warning': !!lamp.state }"
        />
        <transition name="fade">
          <fa-i
            v-if="isOffline"
            class="has-text-danger"
            icon="ban"
            transform="shrink-6 left-2.1 up-2.3"
          />
        </transition>
      </fa-l>
    </i>

    <div class="switch-container">
      <input
        :id="`l${lamp.id}`"
        type="checkbox"
        class="switch is-thin is-rounded"
        :disabled="isOffline"
        :aria-disabled="isOffline"
        :value="!!lamp.state"
        checked="checked"
        @click.prevent="changeLampState"
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
import { disabled } from '../mixins/ioNotConnected'
import ButtonEdit from '../components/ButtonEdit'

export default {
  components: { ButtonEdit },
  mixins: [disabled],
  props: { lamp: { type: Object, required: true } },
  computed: {
    isOffline() {
      return (
        this.disabled ||
        this.lamp.state === undefined ||
        this.lamp.state === null
      )
    },
    iconTitle() {
      return this.disabled
        ? 'Meil puudub ühendus serveriga'
        : this.isOffline
        ? 'Lamp pole onlines või puudub juhtseade'
        : ''
    }
  },
  methods: {
    changeLampState(event) {
      this.$emit('lampStateChanged', this.lamp.id, +event.target.value)
    },
    modify() {
      this.$emit('openEditor', this.lamp.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices_lamps.scss';
@import '../assets/css_fade_transition.scss';

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
