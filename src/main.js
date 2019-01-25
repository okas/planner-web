import Vue from 'vue'
import VueStatic from 'vue-static'
import router from './router'
import store from './store'
import initSocketIO from './plugins/socket.io-plugin'
import initIcons from './plugins/fontAwsomeIcons-plugin'
import I18nSelect from './plugins/i18n-select-plugin'
import { insertFaviconsToDOM } from './utilities'
import LayoutApp from './layouts/App.vue'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

Vue.use(VueStatic)
Vue.use(I18nSelect, { active: 'ee', languages: ['ee', 'en'], store })
initSocketIO()
initIcons('f-a')

const appOptions = {
  store,
  router,
  extends: LayoutApp,
  created: insertFaviconsToDOM([16, 32])
}

new Vue(appOptions).$mount('#app-placeholder')
