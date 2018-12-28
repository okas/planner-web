import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
    alias: '/index'
  },
  {
    path: '*',
    component: './views/HTTP404',
    meta: { title: '404' }
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

const router = new Router({
  mode: 'history',
  routes: componentizer(rawOptions),
  // linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active',
  base: process.env.BASE_URL
})

// Credit: https://alligator.io/vuejs/vue-router-modify-head/
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)

  function complement(h, ...r) {
    return to.fullPath === '/' || !r[0]
      ? h[1].replace('|', '').trim()
      : r[0] + h[1]
  }

  // If a route with a title was found, set the document (page) title to that value.
  document.title = complement`${nearestWithTitle.meta.title} | SaarTK`

  next()
})

export default router
