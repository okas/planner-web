import Vue from 'vue'
import VueStatic from 'vue-static'
import router from './router'
import store from './store'
import VueSocketIoWrapper from './plugins/vue-socket.io-wrapper'
import './fa-icons'
import { VueI18nSelect } from './plugins/vue-i18n-select'
import { insertFaviconsToDOM } from './utilities'
import LayoutApp from './layouts/App.vue'
import './assets/app_imports.scss'

const devMode = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = devMode

Vue.use(VueStatic)
Vue.use(
  VueSocketIoWrapper,
  {
    uri: '/',
    path: '/api',
    transports: ['websocket', 'polling'],
    forceNew: true,
    autoConnect: false
  },
  {
    debug: devMode,
    vuex: {
      store,
      actionPrefix: 'a_io_',
      mutationPrefix: 'M_IO_'
    }
  }
)
Vue.use(VueI18nSelect, { store, active: 'et', languages: ['et', 'en', 'es'] })

const appOptions = {
  store,
  router,
  extends: LayoutApp,
  created: insertFaviconsToDOM([16, 32])
}

new Vue(appOptions).$mount('#app-placeholder')
