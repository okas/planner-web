import { setLanguage, localStorageKey } from './constants'
import i18SelectMixin from './mixin'

export { default } from './I18nSelect.vue'
export { i18SelectMixin }

/**
 * This plugin does following:
 * 1) adds language list to property `Vue.prototype.$languages`;
 * 2) optionally applies Mixin to `Vue.prototype`;
 * 3) adds active language to store in following order:
 * 3.1) seeks `localStorage['VueI18nSelect:active']`
 * 3.2) options `active: 'lang'`,
 * 3.3) default `'en'`.
 */
export const VueI18nSelect = {
  install(Vue, { store, active = 'en', languages = ['en'], global = false }) {
    Vue.prototype.$languages = languages
    if (global) Vue.mixin(i18SelectMixin)
    store.commit(setLanguage, localStorage.getItem(localStorageKey) || active)
  }
}

/**
 * Vuex module for vue-i18n-select.
 */
export const storeModule = {
  state: { active: '' },
  mutations: {
    [setLanguage]: (s, lang) => (s.active = lang)
  }
}

/**
 * Vuex plugin. Subscribes to vue-i18n-select language change mutations to:
 * 1) sets DOM's set value for DOM <html lang="value">.
 * 2) set language to localStorage with key `VueI18nSelect:active`.
 * LocalStorage value is loaded by plugin if browser is reloaded.
 */
export const VuexI18nSelect = store => {
  store.subscribe(mutation => {
    if (mutation.type === setLanguage) {
      document.documentElement.lang = mutation.payload
      localStorage.setItem(localStorageKey, mutation.payload)
    }
  })
}
