export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let rooms = vm.$options.socketRooms
      if (!rooms) {
        return
      }
      vm.$socket.emit('api__join_rooms', rooms, data => {
        if (data.status === 'ok') {
          console.log(`API: joined to rooms "${rooms}".`)
        } else {
          console.error(`API: failed to join to room "${rooms}".`, data.errors)
        }
      })
    })
  },
  beforeRouteLeave(to, from, next) {
    let rooms = this.$options.socketRooms
    if (rooms) {
      this.$socket.emit('api__leave_rooms', rooms, data => {
        if (data.status === 'ok') {
          console.log(`API: leaved rooms "${rooms}".`)
        } else {
          console.error(
            `API: failed to leave from rooms "${rooms}".`,
            data.errors
          )
        }
      })
    }
    next()
  }
}
