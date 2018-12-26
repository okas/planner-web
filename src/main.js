import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueHead from 'vue-head'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

Vue.use(VueHead, { complement: 'SaarTK' })

window.Vue = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-placeholder')
