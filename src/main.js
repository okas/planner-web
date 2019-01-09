import Vue from 'vue'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import initSocketIO from './socket.io-plugin'
import { insertFaviconsToDOM } from './utilities'
import initIcons from './fontAwsomeIcons'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

initSocketIO()
initIcons('f-a')

const options = {
  name: 'Main',
  store,
  router,
  render: h => h(App),
  created: insertFaviconsToDOM([16, 32])
}

new Vue(options).$mount('#app-placeholder')
