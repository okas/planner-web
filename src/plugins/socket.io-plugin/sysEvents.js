export default function register(socket) {
  let id = undefined
  const color = 'MediumPurple'

  socket.on('connect', () => {
    id = socket.id
    console.info(`%c|-> [ ${id} ] : connected with id.`, `color:${color}`)
  })

  socket.on('reconnect_attempt', () => {
    console.warn(
      '! socket.io is reconnectiong: set transports to polling+websocket just in case.'
    )
    socket.io.opts.transports = ['polling', 'websocket']
  })

  socket.on('disconnect', reason => {
    console.info(`%c>-| [ ${id} ] : reason: "${reason}"`, `color:${color}`)
    // Be more forceful here ? Transport errors will make it give up..
    if (reason !== ('forced close', 'io client disconnect')) {
      socket.connect()
    }
  })

  socket.on('connect_error', error => {
    console.log(`event: "connection_error" : [ ${error} ]`)
  })

  socket.on('connect_timeout', timeout => {
    console.log(`event: "connect_timeout" : [ ${timeout} ]`)
  })

  socket.on('error', error => {
    console.log(`event: "error" : [ ${error} ]`)
  })

  socket.on('reconnect', attemptNumber => {
    console.log(`event: "reconnect" : [ ${attemptNumber} ]`)
  })

  socket.on('reconnecting', attemptNumber => {
    console.log(`event: "reconnecting" : [ ${attemptNumber} ]`)
  })

  socket.on('reconnect_error', error => {
    console.log(`event: "reconnect_error" : [ ${error} ]`)
  })

  socket.on('reconnect_failed', () => {
    console.log('event: "reconnect_failed" ')
  })
}
