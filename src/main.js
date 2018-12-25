import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueHead from 'vue-head'

Vue.config.productionTip = false

Vue.use(VueHead, { complement: 'SaarTK' })

window.Vue = new Vue({
  el: '#app-placeholder',
  store,
  router,
  template: '<app/>',
  components: { App }
})
