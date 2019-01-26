export default function register(socket) {
  let id = undefined
  const color = 'MediumPurple'

  socket.on('connect', () => {
    id = socket.id
    console.info(`%c|-> [ ${id} ] : connected with id.`, `color:${color}`)
  })

  socket.on('reconnect_attempt', attemptNumber => {
    console.warn(
      `! socket.io is reconnectiong: [ ${attemptNumber} ] : set transports to polling+websocket just in case.`
    )
    socket.io.opts.transports = ['polling', 'websocket']
  })

  socket.on('disconnect', reason => {
    console.info(`%c>-| [ ${id} ] : reason: "${reason}"`, `color:${color}`)
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
}
