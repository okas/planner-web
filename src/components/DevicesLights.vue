<template>
  <section id="ligths">
    <h1 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle"/>
    <article>
      <a class="button" @click="ioGetAllLamps">Päri lambid</a>
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
                :id="`s_${l.$loki}`"
                v-model="l.state"
              >
              <label :for="`s_${l.$loki}`"/>
            </li>
          </ul>
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
      groupedLamps: []
    }
  },
  methods: {
    ioGetAllLamps() {
      socket.emit('get-all-room_lamps', data => (this.groupedLamps = data))
    }
  },
  beforeCreate() {
    socket = socketIOclient('/', { autoConnect: false })
    let id = undefined
    socket.on('connect', () => {
      id = socket.id
      console.debug(`|-> [ ${id} ] : connected with id`)
    })
    socket.on('disconnect', reason => {
      console.debug(`>-| [ ${id} ] : reason: "${reason}"`)
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
