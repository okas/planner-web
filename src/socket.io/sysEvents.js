const color = 'color:MediumPurple'

export default function register(socket) {
  socket.on('connect', () => {
    console.info(`%c|-> [ ${socket.id} ] : id.`, color)
  })

  socket.on('reconnect_attempt', attemptNumber => {
    console.warn(
      `! socket.io is reconnectiong: [ ${attemptNumber} ] : set transports to polling+websocket just in case.`
    )
    socket.io.opts.transports = ['polling', 'websocket']
  })

  socket.on('disconnect', reason => {
    console.info(`%c>-| [ ${socket.id} ] : reason: "${reason}"`, color)
  })

  socket.on('connect_error', error => {
    console.error(`socket.io event: "connection_error" : [ ${error} ]`)
  })

  socket.on('connect_timeout', timeout => {
    console.log(`socket.io event: "connect_timeout" : [ ${timeout} ]`)
  })

  socket.on('error', error => {
    console.error(`socket.io event: "error" : [ ${error} ]`)
  })

  // socket.on('reconnect', attemptNumber => {
  //   console.warn(`socket.io event: "reconnect" : [ ${attemptNumber} ]`)
  // })

  // socket.on('reconnecting', attemptNumber => {
  //   console.warn(`socket.io event: "reconnecting" : [ ${attemptNumber} ]`)
  // })

  // socket.on('reconnect_error', error => {
  //   console.error(`socket.io event: "reconnect_error" : [ ${error} ]`)
  // })

  socket.on('reconnect_failed', () => {
    console.error('socket.io event: "reconnect_failed" ')
  })

  /* For chaining */
  return socket
}
