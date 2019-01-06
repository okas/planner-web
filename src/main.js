import Vue from 'vue'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import { insertFaviconsToDOM } from './utilities'
import setupIcons from './fontAwsomeIcons'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

setupIcons('f-a')

const options = {
  name: 'Main',
  store,
  router,
  render: h => h(App),
  created: insertFaviconsToDOM([16, 32])
}

new Vue(options).$mount('#app-placeholder')
