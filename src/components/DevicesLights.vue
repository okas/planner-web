<template>
  <section id="ligths">
    <h1 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle"/>
    <article>
      <a class="button" @click="ioGetAllLamps">Värskenda</a>
      <ul>
        <li class="box" v-for="(lamps, room) of groupedLamps" :key="room">
          <p class="subtitle is-4 has-text-weight-light" v-text="room"/>
          <ul>
            <li class="box" v-for="l in lamps" :key="l.$loki">
              <p class="is-size-5" v-text="l.name"/>
              <f-a class="fa-3x" icon="lightbulb" :class="{'has-text-warning': !!l.state}"/>
              <input
                class="switch is-thin is-rounded"
                type="checkbox"
                :id="`l_${l.$loki}`"
                v-model="l.state"
              >
              <label :for="`l_${l.$loki}`"/>
            </li>
          </ul>
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      appTitle: 'Tuled',
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
    // Can be combined with addtional component display whileloading. "Ater Nav Fetch"
    this.ioGetAllLamps()
  }
}
</script>

<style lang="scss">
#ligths {
  border: 1px blueviolet solid;
}
</style>
