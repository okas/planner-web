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
}
