import _path from 'path'

// This is important for webpack lazy load! We need to return relative path.
// NB! Output cannot be be prefixed with '@' as we do it during Webpack lazy loading.
// See warning notification boxes below the "Magic Comments" section: https://webpack.js.org/api/module-methods/#magic-comments
// Otherwise Webpack cannot infer and/or register correct path without @ in method call!
export function convertForWebPackLazyLoad(path) {
  return _path.resolve(path.startsWith('@') ? path.slice(1) : path).slice(1)
}

export function insertFaviconsToDOM(sizes, assestsDir = './assets') {
  let p = convertForWebPackLazyLoad(
    assestsDir.endsWith('/') ? assestsDir.slice(0, -1) : assestsDir
  )
  sizes.forEach(s => {
    window.document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="shortcut icon" href="${require(`@/${p}/favicon-${s}x${s}.png`)}" sizes="${s}x${s}" type="image/png">`
    )
  })
}
