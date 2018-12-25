import Vue from 'vue'
import Router from 'vue-router'

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
    path: '/*',
    component: 'NotFound'
  }
]

function componentizer(routerOptions) {
  return routerOptions.map(opt => {
    return {
      ...opt,
      component: () => import(`@/components/${opt.component}.vue`),
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
