import Vue from 'vue'
import Router from 'vue-router'

// We use views in routing rathr than components.
// Views should consume components.
// Views are like layouts.

// Use full paths for components as it simplifiest componentizer work.
// IDE provides very good support, its is not 'costly' to give/type it :)
const rawOptions = [
  {
    path: '/devices',
    component: './views/Devices',
    redirect: { name: 'lights' },
    meta: { title: 'Seadmed' },
    children: [
      {
        path: 'lights',
        component: './components/DevicesLights',
        name: 'lights',
        meta: { title: 'Valgustid', alt: 'Tulede juhtimine' }
      },
      {
        path: 'windowblinds',
        component: './components/DevicesWindowBlinds',
        name: 'windowblinds',
        meta: { title: 'Rulood' }
      },
      {
        path: 'irrigation',
        component: './components/DevicesIrrigation',
        name: 'irrigation',
        meta: { title: 'Kastmine' }
      }
    ]
  },
  {
    path: '/',
    component: './views/Home.vue',
    alias: '/index',
    meta: { title: 'Kodu' }
  },
  {
    path: '*',
    component: './views/HTTP404'
  }
]

function componentizer(options) {
  return options.map(opt => {
    return {
      ...opt,
      component: () => import(`${opt.component}`),
      ...(opt.hasOwnProperty('children') && {
        children: componentizer(opt.children)
      })
    }
  })
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: componentizer(rawOptions),
  // linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active',
  base: process.env.BASE_URL
})
