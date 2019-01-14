<template>
  <section id="windowblinds">
    <header>
      <slot name="header-title" :_class="'has-text-success'"/>
      <p class="has-text-success">Roloode süsteemi armatuurlaud</p>
      <a class="button" @click="ioGetAllBlinds">
        <f-a icon="sync-alt"/>
      </a>
    </header>
    <div class="rooms-grid">
      <section class="room" v-for="(blinds, room) of groupedBlinds" :key="room">
        <h3 class="title is-4" v-text="room"/>
        <div class="remotes-grid">
          <remote v-for="b in blinds" :key="b.id" :blind="b"/>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import Remote from '../components/DevicesWindowBlindsRemote'
export default {
  name: 'WindowBlinds',
  data() {
    return { groupedBlinds: [] }
  },
  components: { Remote },
  methods: {
    ioGetAllBlinds() {
      this.$socket.emit(
        'get-all-room_blinds',
        data => (this.groupedBlinds = data)
      )
    }
  },
  created() {
    // Can be combined with addtional component display while loading. "After Nav Fetch"
    this.ioGetAllBlinds()
  }
}
</script>

<style lang="scss" scoped>
$remote-width: 149px;
$remote-height: 274.5px;

#windowblinds > header {
  margin: 0 0 3rem;
}
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
