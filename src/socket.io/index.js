import Vue from 'vue'
import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from '../store'
import registerEvents from './sysEvents'

const mode = process.env.NODE_ENV !== 'production'

const ioClientConf = {
  uri: '/',
  path: '/api',
  transports: ['websocket', 'polling'],
  forceNew: true,
  autoConnect: false
}

const socket = registerEvents(SocketIOClient(ioClientConf))

const vueSocketConf = {
  connection: socket,
  debug: mode,
  vuex: {
    store,
    actionPrefix: 'a_io_',
    mutationPrefix: 'M_IO_'
  }
}

Vue.use(new VueSocketIO(vueSocketConf))
socket.connect()
