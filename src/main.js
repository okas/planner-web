import Vue from 'vue'
import VueStatic from 'vue-static'
import router from './router'
import store from './store'
import './socket.io'
import './fa-icons'
import { VueI18nSelect } from './plugins/vue-i18n-select'
import { insertFaviconsToDOM } from './utilities'
import LayoutApp from './layouts/App.vue'
import './assets/app_imports.scss'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

Vue.use(VueStatic)
Vue.use(VueI18nSelect, { store, active: 'et', languages: ['et', 'en', 'es'] })

const appOptions = {
  store,
  router,
  extends: LayoutApp,
  created: insertFaviconsToDOM([16, 32])
}

new Vue(appOptions).$mount('#app-placeholder')
