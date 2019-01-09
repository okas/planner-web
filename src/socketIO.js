import Vue from 'vue'
import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from './store'

const mode = process.env.NODE_ENV !== 'production'
let isInitialized = false

/* Initial configs */

const initialSocketIoClientConfig = {
  path: '/api',
  transports: ['websocket', 'polling'],
  uri: '/'
}
const initialVueSocketIoConfig = {
  debug: mode,
  vuex: { store, actionPrefix: 'a_io_', mutationPrefix: 'm_io_' }
}

function registerSocketEvents(socket) {
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

function enforceSocketIoClientConfig(config) {
  if (config.autoConnect == true) {
    console.warn(
      `! socket.io-client, autoConnect: "${
        config.autoConnect
      }": socket.io is connected just after setting up all the events, this setting will be enforced to "false".`
    )
  }
  config.autoConnect = false
}

function enforceVueSocketIoConfig(config) {
  if (config.connection) {
    console.warn(
      `! vue-socket.io, connection: "${
        config.connection
      }": use param "socketIoclientConfig" to configure socket.io-client.`
    )
  }
  config.connection = null
}

/* Using init function to inject options to this module */

export default function init(
  vueSocketIoConfig = {},
  socketIoClientConfig = {}
) {
  /* Allow init at most once. */
  if (isInitialized) {
    return
  }
  enforceVueSocketIoConfig(vueSocketIoConfig)
  enforceSocketIoClientConfig(socketIoClientConfig)
  const socket = SocketIOClient({
    ...initialSocketIoClientConfig,
    ...socketIoClientConfig
  })
  registerSocketEvents(socket)
  socket.connect()
  Vue.use(
    new VueSocketIO({
      ...initialVueSocketIoConfig,
      ...vueSocketIoConfig,
      ...{ connection: socket }
    })
  )
  isInitialized = true
}
