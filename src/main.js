import Vue from 'vue'
import VueStatic from 'vue-static'
import App from './layouts/App.vue'
import router from './router'
import store from './store'
import initSocketIO from './plugins/socket.io-plugin'
import { insertFaviconsToDOM } from './utilities'
import initIcons from './plugins/fontAwsomeIcons-plugin'
import I18nSelect from './plugins/i18n-select-plugin'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

Vue.use(VueStatic)
Vue.use(I18nSelect, { active: 'ee', languages: ['ee', 'en'], store })
initSocketIO()
initIcons('f-a')

const options = {
  store,
  router,
  created: insertFaviconsToDOM([16, 32])
}

const AppClass = Vue.extend(App)
new AppClass(options).$mount('#app-placeholder')
