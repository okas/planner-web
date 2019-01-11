import path from 'path'

// This is important for webpack lazy load! We need to return relative path.
// NB! Output cannot be be prefixed with '@' as we do it during Webpack lazy loading.
// See warning notification boxes below the "Magic Comments" section: https://webpack.js.org/api/module-methods/#magic-comments
// Otherwise Webpack cannot infer and/or register correct path without @ in method call!
var convert = c => path.resolve(c.startsWith('@') ? c.slice(1) : c).slice(1)

export function resolveRouteOptionComponents(routeOptions) {
  return routeOptions.map(opt => {
    return {
      ...opt,
      component: () =>
        import(/* webpackChunkName: "[request]" */ `@/${convert(
          opt.component
        )}`),
      ...(opt.hasOwnProperty('children') && {
        children: resolveRouteOptionComponents(opt.children)
      })
    }
  })
}

export function setHtmlHeadTitle(mathcedRoutes, complement, saparator = ' | ') {
  // Credit: https://alligator.io/vuejs/vue-router-modify-head/
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = mathcedRoutes
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)
  // If a route with a title was found, set the document (page) title to that value.

  document.title = !nearestWithTitle
    ? complement
    : `${nearestWithTitle.meta.title}${saparator}${complement}`
}
