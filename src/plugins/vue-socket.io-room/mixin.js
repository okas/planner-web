export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let room = extractRoom(vm)
      if (!room) {
        return
      }
      vm.$socket.emit('api__join_room', room, data => {
        if (data.status === 'ok') {
          console.log(`API: joined to room "${room}".`)
        } else {
          console.error(`API: failed to join to room "${room}".`, data.errors)
        }
      })
    })
  },
  beforeRouteLeave(to, from, next) {
    let room = extractRoom(this)
    if (room) {
      this.$socket.emit('api__leave_room', room, data => {
        if (data.status === 'ok') {
          console.log(`API: leaved room "${room}".`)
        } else {
          console.error(
            `API: failed to leave from room "${room}".`,
            data.errors
          )
        }
      })
    }
    next()
  }
}

function extractRoom(vm) {
  return vm.$options.socketRoom
}
