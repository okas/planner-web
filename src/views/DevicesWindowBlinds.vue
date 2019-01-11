<template>
  <section id="windowlinds">
    <header>
      <p class="has-text-success">Roloode süsteemi armatuurlaud</p>
      <a class="button" @click="ioGetAllBlinds">
        <f-a icon="sync-alt"/>
      </a>
    </header>
    <section class="room has-text-centered" v-for="(blinds, room) of groupedBlinds" :key="room">
      <h3 class="title is-4" v-text="room"/>
      <ul>
        <li v-for="b in blinds" :key="b.id">
          <remote :blind="b"/>
        </li>
      </ul>
    </section>
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
