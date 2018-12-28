import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = process.env.NODE_ENV !== 'production'

const options = {
  name: 'Main',
  store,
  router,
  render: h => h(App),
  created: createFavicons([16, 32])
}

new Vue(options).$mount('#app-placeholder')

function createFavicons(sizes) {
  sizes.forEach(s => {
    window.document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="shortcut icon" href="${require(`./assets/favicon-${s}x${s}.png`)}" sizes="${s}x${s}" type="image/png">`
    )
  })
}
