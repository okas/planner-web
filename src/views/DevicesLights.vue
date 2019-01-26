<template>
  <section id="ligths">
    <header class="component-header">
      <slot name="header-title" :_class="{'has-text-warning': true}"/>
      <a class="button" role="button" :disabled="!$store.state.ioConnected" @click="ioGetAllLamps">
        <fa-i icon="sync-alt"/>
      </a>
    </header>
    <div class="rooms-grid">
      <section class="room" v-for="room in groupedLamps" :key="room.id">
        <h3 class="subtitle is-5 has-text-weight-light" v-text="room.id"/>
        <div class="lamps-grid">
          <lamp v-for="lamp in room.items" :key="lamp.id" :lamp.sync="lamp"/>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import Lamp from '../components/DevicesLightsLamp'
export default {
  name: 'Lights',
  components: { Lamp },
  data() {
    return {
      groupedLamps: []
    }
  },
  methods: {
    ioGetAllLamps() {
      this.$socket.emit(
        'get-all-room_lamps',
        data => (this.groupedLamps = data)
      )
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllLamps()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices_lights.scss';

.rooms-grid {
  display: grid;
  gap: 2.5rem;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax($lamp-width, auto));
  .lamps-grid {
    display: grid;
    gap: 1.5rem;
    grid-auto-flow: dense;
    justify-content: start;
    grid-template-columns: repeat(auto-fit, minmax($lamp-width, auto));
  }
}
</style>
