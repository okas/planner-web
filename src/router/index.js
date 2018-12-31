import Vue from 'vue'
import Router from 'vue-router'
import { setHtmlHeadTitle, resolveRouteOptionComponents } from './plugins'
import { rawRoutes } from './rawRoutes'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: resolveRouteOptionComponents(rawRoutes),
  linkActiveClass: 'is-active router-link-active',
  linkExactActiveClass: 'is-active router-link-exact-active',
  base: process.env.BASE_URL
})

export default router

// Use router add-ons here
router.beforeEach((to, from, next) => {
  // Complement can betaken fomr config
  setHtmlHeadTitle(to.matched, 'SaarTK')
  next()
})
