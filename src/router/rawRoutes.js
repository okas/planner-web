// We use views in routing rather than components.
// If views are used as layout, they consume components.
// Use full paths for components as it simplifiest componentizer work.
// IDE provides very good support, its is not 'costly' to give/type it :)
export default [
  {
    path: '/devices',
    component: '../views/Devices.vue',
    redirect: { name: 'lights' },
    meta: { title: 'Seadmed' },
    children: [
      {
        path: 'lights',
        component: '../components/DevicesLights.vue',
        name: 'lights',
        meta: { title: 'Valgustid', alt: 'Tulede juhtimine' }
      },
      {
        path: 'windowblinds',
        component: '../components/DevicesWindowBlinds.vue',
        name: 'windowblinds',
        meta: { title: 'Rulood' }
      },
      {
        path: 'irrigation',
        component: '../components/DevicesIrrigation.vue',
        name: 'irrigation',
        meta: { title: 'Kastmine' }
      }
    ]
  },
  {
    path: '/about',
    component: '../views/About.vue',
    meta: { title: 'Info' }
  },
  {
    path: '/',
    component: '../views/Home.vue',
    alias: '/index'
  },
  {
    path: '*',
    component: '../views/HTTP404.vue',
    meta: { title: '404' }
  }
]
