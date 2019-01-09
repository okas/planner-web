import Vue from 'vue'
import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from '../store'
import registerEvents from './sysEvents'

const mode = process.env.NODE_ENV !== 'production'
let isInitialized = false

/* Initial configs */

const initialSocketIoClientConfig = {
  path: '/api',
  // transports: ['websocket', 'polling'],
  uri: '/',
  reconnectionAttempts: 10000,
  reconnectionDelay: 500,
  reconnectionDelayMax: 1000,
  randomizationFactor: 0.25,
  timeout: 5000,
  forceNew: true
}
const initialVueSocketIoConfig = {
  debug: mode,
  vuex: { store, actionPrefix: 'a_io_', mutationPrefix: 'm_io_' }
}

function enforceSocketIoClientConfig(config) {
  if (config.autoConnect == true) {
    console.warn(
      `! socket.io-client, autoConnect: "${
        config.autoConnect
      }": socket.io is connected just after setting up all the events, this setting will be enforced to "false".`
    )
  }
  config.autoConnect = true
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
  registerEvents(socket)
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
