export default {
  beforeCreate() {
    const { socketRooms } = this.$options
    if (socketRooms) {
      joinRooms(this.$socket, socketRooms)
      const fn = joinRooms.bind(undefined, this.$socket, socketRooms)
      this.$vueSocketIo.emitter.addListener('reconnect', fn, this)
    }
  },
  beforeRouteLeave(to, from, next) {
    const { socketRooms } = this.$options
    if (socketRooms) {
      leaveRooms(this.$socket, socketRooms)
      this.$vueSocketIo.emitter.removeListener('reconnect', this)
    }
    next()
  }
}

function joinRooms(socket, rooms) {
  socket.emit('api__join_rooms', rooms, data => {
    if (data.status === 'ok') {
      console.log(`API: joined to rooms "${rooms}".`)
    } else {
      console.error(`API: failed to join to room "${rooms}".`, data.errors)
    }
  })
}

function leaveRooms(socket, rooms) {
  socket.emit('api__leave_rooms', rooms, data => {
    if (data.status === 'ok') {
      console.log(`API: leaved rooms "${rooms}".`)
    } else {
      console.error(`API: failed to leave from rooms "${rooms}".`, data.errors)
    }
  })
}
