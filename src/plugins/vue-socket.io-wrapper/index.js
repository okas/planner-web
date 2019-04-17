import SocketIOClient from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import registerSystemEvents from './sysEvents'
import mixin from './mixin'

export default {
  install(Vue, ioClientConf, vueSocketConf) {
    const socket = SocketIOClient(ioClientConf)
    registerSystemEvents(socket)
    Vue.use(
      new VueSocketIO({
        ...vueSocketConf,
        connection: socket
      })
    )
    Vue.mixin(mixin)
    socket.connect()
  }
}
