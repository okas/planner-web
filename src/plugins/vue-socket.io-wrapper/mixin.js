export default {
  beforeCreate() {
    const rooms = this.$options.socketRooms
    if (rooms) {
      joinRooms(this.$socket, rooms)
      const fn = joinRooms.bind(undefined, this.$socket, rooms)
      this.$vueSocketIo.emitter.addListener('reconnect', fn, this)
    }
  },
  beforeRouteLeave(to, from, next) {
    const rooms = this.$options.socketRooms
    if (rooms) {
      leaveRooms(this.$socket, rooms)
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
