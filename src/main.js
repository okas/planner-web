import Vue from 'vue'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import { insertFaviconsToDOM } from './utilities'
import initIcons from './fontAwsomeIcons'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

initIcons('f-a')

const options = {
  name: 'Main',
  store,
  router,
  render: h => h(App),
  created: insertFaviconsToDOM([16, 32])
}

let socket = socketIOclient('/', {
  autoConnect: false,
  transports: ['websocket']
})
let id = undefined
socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket']
})
socket.on('connect', () => {
  id = socket.id
  console.debug(`|-> [ ${id} ] : connected with id`)
})
socket.on('disconnect', reason => {
  console.debug(`>-| [ ${id} ] : reason: "${reason}"`)
  // Be more forceful here ? Transport errors will make it give up..
  if (reason !== ('forced close', 'io client disconnect')) {
    socket.connect()
  }
})
socket.connect()
Vue.prototype.$io = socket

new Vue(options).$mount('#app-placeholder').$destroyed = () =>
  socket.disconnect()
