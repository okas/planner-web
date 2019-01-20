// We use views in routing rather than components.
// If views are used as layout, they consume components.
// Use full paths for components as it simplifiest componentizer work.
// IDE provides very good support, its is not 'costly' to give/type it :)
export default [
  {
    path: '/devices',
    component: '../layouts/Devices.vue',
    redirect: { name: 'lights' },
    meta: { title: 'Seadmed' },
    children: [
      {
        path: 'lights',
        component: '../views/DevicesLights.vue',
        name: 'lights',
        meta: { title: 'Valgustid', alt: 'Tulede juhtimine' }
      },
      {
        path: 'blinds',
        component: '../views/DevicesBlinds.vue',
        name: 'blinds',
        meta: { title: 'Rulood' }
      },
      {
        path: 'irrigation',
        component: '../views/DevicesIrrigation.vue',
        name: 'irrigation',
        meta: { title: 'Kastmine' }
      },
      {
        path: 'presets',
        component: '../views/DevicesPresets.vue',
        name: 'dev-presets',
        meta: { title: 'Eelseadistused', alt: 'Seadistused hulgijuhtimiseks' }
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
