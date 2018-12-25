import Vue from 'vue'
import Router from 'vue-router'

// We use views in routing rathr than components.
// Views should consume components.
// Views are like layouts.

const routeOptions = [
  {
    path: '/lights',
    name: 'lights',
    component: 'Lights'
  },
  {
    path: '/',
    alias: '/index',
    name: 'home',
    component: 'Home'
  },
  {
    path: '*',
    component: 'HTTP404'
  }
]

// Set up lazy loading
function componentizer(routerOptions) {
  return routerOptions.map(opt => {
    return {
      ...opt,
      component: () => import(`@/views/${opt.component}.vue`),
      ...(opt.hasOwnProperty('children') && {
        children: componentizer(opt.children)
      })
    }
  })
}

Vue.use(Router)

export default new Router({
  routes: componentizer(routeOptions),
  mode: 'history',
  base: process.env.BASE_URL
})
