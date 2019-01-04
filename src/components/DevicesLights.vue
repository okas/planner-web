<template>
  <section id="ligths">
    <h1 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle"/>
    <article>
      <a class="button" @click="ioGetAllLamps">Päri lambid</a>
      <ul>
        <li class="field" v-for="l in lamps" :key="l.$loki">
          <input
            class="switch is-thin is-rounded is-outlined"
            type="checkbox"
            :id="`l-switch${l.$loki}`"
            v-model="l.state"
          >
          <label :for="`l-switch${l.$loki}`" v-text="l.name"/>
          <div class="icon is-large"></div>
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
import socketIOclient from 'socket.io-client'

let socket = undefined

export default {
  data() {
    return {
      appTitle: 'Tuled',
      lamps: [],
      iSize: 48
    }
  },
  computed: {},
  methods: {
    ioGetAllLamps() {
      socket.emit('lamps-get_all', data => {
        // console.log(data)
        this.lamps = data
      })
    }
  },
  beforeCreate() {
    socket = socketIOclient('/', { autoConnect: false })
    let id = undefined
    socket.on('connect', () => {
      id = socket.id
      console.debug(`|-- [ ${id} ] : connected with id -->`)
    })
    socket.on('disconnect', reason => {
      console.debug(`--> [ ${id} ] : reason: "${reason}" --|`)
      // Be more forceful here ? Transport errors will make it give up..
      if (reason !== ('forced close', 'io client disconnect')) {
        socket.connect()
      }
    })
    socket.connect()
  },
  beforeDestroy: () => socket.disconnect()
}
</script>

<style lang="scss">
#ligths {
  border: 1px blueviolet solid;
}
</style>
