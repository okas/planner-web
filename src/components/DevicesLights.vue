<template>
  <section id="ligths">
    <header>
      <h2 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle"/>
      <a class="button" @click="ioGetAllLamps">Värskenda</a>
    </header>
    <section class="room section" v-for="(lamps, room) of groupedLamps" :key="room">
      <h3 class="subtitle is-5 has-text-weight-light" v-text="room"/>
      <ul class="columns is-multiline is-mobile">
        <li
          class="column is-2-widescreen is-one-fifth-desktop is-one-quarter-tablet is-third-mobile"
          v-for="l in lamps"
          :key="l.id"
        >
          <div class="lamp box">
            <h4 class="lamp-name is-size-6" v-text="l.name"/>
            <f-a class="lamp-icon fa-2x" icon="lightbulb" :class="{'has-text-warning': !!l.state}"/>
            <div class="switch-container">
              <input
                class="switch is-thin is-rounded"
                type="checkbox"
                :id="`l${l.id}`"
                v-model="l.state"
              >
              <label class="switch-label" :for="`l${l.id}`"/>
            </div>
          </div>
        </li>
      </ul>
    </section>
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
#ligths > header {
  margin: 0 0 3rem;
}
.room.section {
  padding: 0 0 2.5rem;
  .lamp {
    display: grid;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.25rem;
    grid-template-areas:
      'n n'
      'i s';
    grid-template-columns: 37.5% 63.25%;
    justify-content: center;
    &.box {
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
}
</style>
