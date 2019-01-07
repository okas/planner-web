import Vue from 'vue'
import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

const mode = process.env.NODE_ENV !== 'production'

export default function init(
  socketIoConfig = {
    path: '/api',
    transports: ['websocket', 'polling'],
    uri: '/'
  }
) {
  if (socketIoConfig.autoConnect == true) {
    console.warn(
      `! autoConnect: "${
        socketIoConfig.autoConnect
      }": socket.io is connected just after setting up all the events, this setting will be enforced to "false".`
    )
    socketIoConfig.autoConnect = false
  }

  let id = undefined
  const socket = SocketIOClient('/', socketIoConfig)

  socket.on('reconnect_attempt', () => {
    console.warn(
      '! socket.io is reconnectiong: set transports to polling+websocket just in case.'
    )
    socket.io.opts.transports = ['polling', 'websocket']
  })

  socket.on('connect', () => {
    id = socket.id
    console.info(`%c|-> [ ${id} ] : connected with id.`, 'color:purple')
  })

  socket.on('disconnect', reason => {
    console.info(`%c>-| [ ${id} ] : reason: "${reason}"`, 'color:purple')
    // Be more forceful here ? Transport errors will make it give up..
    if (reason !== ('forced close', 'io client disconnect')) {
      socket.connect()
    }
  })

  socket.connect()

  Vue.use(
    new VueSocketIO({
      debug: mode,
      connection: socket
    })
  )
}
