<template>
  <section id="ligths">
    <header>
      <slot name="header-title" :_class="{'has-text-warning': true}"/>
      <a class="button" @click="ioGetAllLamps">
        <f-a icon="sync-alt"/>
      </a>
    </header>
    <div class="rooms-grid">
      <section class="room" v-for="(lamps, room) of groupedLamps" :key="room">
        <h3 class="subtitle is-5 has-text-weight-light" v-text="room"/>
        <div class="lamps-grid">
          <lamp v-for="l in lamps" :key="l.id" :lamp="l"/>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import Lamp from '../components/DevicesLightsLamp'
export default {
  name: 'Lights',
  data() {
    return {
      groupedLamps: []
    }
  },
  components: { Lamp },
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

#ligths > header {
  margin: 0 0 3rem;
}
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
