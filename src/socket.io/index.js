import Vue from 'vue'
import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import registerEvents from './sysEvents'

const mode = process.env.NODE_ENV !== 'production'
let isInitialized = false

const ioClientConf = {
  uri: '/',
  path: '/api',
  transports: ['websocket', 'polling'],
  forceNew: true
}

const vueSocketConf = {
  debug: mode,
  vuex: { actionPrefix: 'a_io_', mutationPrefix: 'M_IO_' }
}

/**
 * Bootstraps socket.io-client and vue-socket.io.
 * @param store - Vuex Store instance.
 */
export default function init(store) {
  /* Allow init at most once. */
  if (isInitialized) {
    return
  }
  const socket = SocketIOClient(ioClientConf)
  registerEvents(socket)
  vueSocketConf.connection = socket
  vueSocketConf.vuex.store = store
  Vue.use(new VueSocketIO(vueSocketConf))
  socket.connect()
  isInitialized = true
}
