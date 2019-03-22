<template>
  <section id="blinds">
    <header class="component-header">
      <slot name="header-title" :_class="'has-text-success'" />
      <p class="has-text-success">Roloode süsteemi armatuurlaud</p>
      <div class="commands field is-grouped is-marginless">
        <div class="control">
          <button-reload title="Värskenda serverist" @click="ioGetAllBlinds" />
        </div>
      </div>
    </header>
    <div class="rooms-grid">
      <section v-for="room of groupedBlinds" :key="room.id" class="room">
        <h3 class="title is-4" v-text="room.id" />
        <div class="remotes-grid">
          <remote
            v-for="blind in room.items"
            :key="blind.id"
            :blind.sync="blind"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import ButtonReload from '../components/ButtonReload'
import Remote from '../components/DevicesBlindsRemote'

export default {
  name: 'Blinds',
  components: { ButtonReload, Remote },
  data() {
    return { groupedBlinds: [] }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllBlinds()
  },
  methods: {
    ioGetAllBlinds() {
      this.$socket.emit(
        'get-all-room_blinds',
        data => (this.groupedBlinds = data)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/devices-blinds.scss';

.rooms-grid {
  display: grid;
  gap: 3rem;
  grid-auto-flow: dense;
  justify-content: start;
  grid-template-columns: repeat(auto-fit, minmax($remote-width, 1fr));
  .remotes-grid {
    display: grid;
    gap: 1.5rem;
    grid-auto-flow: dense;
    justify-content: start;
    grid-template-columns: repeat(auto-fit, minmax($remote-width, 1fr));
  }
}
</style>
