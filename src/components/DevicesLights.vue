<template>
  <section id="ligths">
    <header>
      <h2 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle"/>
      <a class="button" @click="ioGetAllLamps">
        <f-a icon="sync-alt"/>
      </a>
    </header>
    <section class="room section" v-for="(lamps, room) of groupedLamps" :key="room">
      <h3 class="subtitle is-5 has-text-weight-light" v-text="room"/>
      <ul class="columns is-multiline is-mobile">
        <li
          class="column is-2-widescreen is-one-fifth-desktop is-one-fifth-tablet is-third-mobile is-narrow-mobile"
          v-for="l in lamps"
          :key="l.id"
        >
          <lamp :lamp="l"/>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import Lamp from './DevicesLightsLamp'
export default {
  data() {
    return {
      appTitle: 'Tuled',
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
    // Can be combined with addtional component display whileloading. "Ater Nav Fetch"
    this.ioGetAllLamps()
  }
}
</script>

<style lang="scss" scoped>
#ligths > header {
  margin: 0 0 3rem;
}
.room.section {
  padding: 0 0 2.5rem;
}
</style>
