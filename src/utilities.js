export function insertFaviconsToDOM(sizes, assestsDir = './assets') {
  let p = assestsDir.endsWith('/') ? assestsDir.slice(0, -1) : assestsDir
  sizes.forEach(s => {
    window.document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="shortcut icon" href="${require(`${p}/favicon-${s}x${s}.png`)}" sizes="${s}x${s}" type="image/png">`
    )
  })
}
