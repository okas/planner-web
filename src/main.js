import Vue from 'vue'
import VueStatic from 'vue-static'
import router from './router'
import store from './store'
import initSocketIO from './socket.io'
import initIcons from './faIcons'
import VueI18nSelect from './plugins/vue-i18n-select'
import { insertFaviconsToDOM } from './utilities'
import LayoutApp from './layouts/App.vue'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

Vue.use(VueStatic)
Vue.use(VueI18nSelect, { active: 'ee', languages: ['ee', 'en'], store })
initSocketIO(store)
initIcons('f-a')

const appOptions = {
  store,
  router,
  extends: LayoutApp,
  created: insertFaviconsToDOM([16, 32])
}

new Vue(appOptions).$mount('#app-placeholder')
