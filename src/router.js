import Vue from 'vue'
import Router from 'vue-router'
import { setHtmlHeadTitle, resolveRouteOptionComponents } from './utilities'

Vue.use(Router)

// We use views in routing rathr than components.
// Views should consume components.
// Views are like layouts.

// Use full paths for components as it simplifiest componentizer work.
// IDE provides very good support, its is not 'costly' to give/type it :)
const rawRoutes = [
  {
    path: '/devices',
    component: './views/Devices.vue',
    redirect: { name: 'lights' },
    meta: { title: 'Seadmed' },
    children: [
      {
        path: 'lights',
        component: './components/DevicesLights.vue',
        name: 'lights',
        meta: { title: 'Valgustid', alt: 'Tulede juhtimine' }
      },
      {
        path: 'windowblinds',
        component: './components/DevicesWindowBlinds.vue',
        name: 'windowblinds',
        meta: { title: 'Rulood' }
      },
      {
        path: 'irrigation',
        component: './components/DevicesIrrigation.vue',
        name: 'irrigation',
        meta: { title: 'Kastmine' }
      }
    ]
  },
  {
    path: '/about',
    component: './views/About.vue',
    meta: { title: 'Info' }
  },
  {
    path: '/',
    component: './views/Home.vue',
    alias: '/index'
  },
  {
    path: '*',
    component: './views/HTTP404.vue',
    meta: { title: '404' }
  }
]

export default new Router({
  mode: 'history',
  routes: resolveRouteOptionComponents(rawRoutes),
  linkActiveClass: 'is-active router-link-active',
  linkExactActiveClass: 'is-active router-link-exact-active',
  base: process.env.BASE_URL,
  beforeEach: (to, from, next) => {
    setHtmlHeadTitle(to.matched, 'SaarTK')
    next()
  }
})
