const initialOptions = { active: 'en', languages: ['en'], global: false }
const setLanguage = 'SET_LANGUAGE'
const localStorageKey = 'i18nSelect:active'

let _store

/**
 * This plugin does following:
 * 1) adds language list to as Vue global property;
 * 2) optionally applies Mixin to Vue.prototype;
 * 3) if gets value by key ['i18nSelect:active'] then sets this to Vuex store,
 * 3.1) or uses provided lang from options active:'lang',
 * 3.2) or uses plugin default 'en'.
 */
const I18nSelectPlugin = {
  install(Vue, { active, languages, store, global } = initialOptions) {
    _store = store
    Vue.prototype.$languages = languages
    if (global) Vue.mixin(i18Mixin)
    store.commit(setLanguage, localStorage.getItem(localStorageKey) || active)
  }
}
export default I18nSelectPlugin

/**
 * This mixin is applied by default for I18nSelect SFC.
 * If Vue plugin install gets option global:true, then computed will be applied globally.
 */
export let i18Mixin = {
  computed: {
    $language: {
      get: () => _store.state.i18nSelect.active,
      set: lang => _store.commit(setLanguage, lang)
    }
  }
}

/**
 * Vuex module for i18n-select-plugin.
 */
export let storeModule = {
  state: { active: '' },
  mutations: {
    [setLanguage]: (s, lang) => (s.active = lang)
  }
}

/**
 * Subscribes to i18n-select-plugin language change mutations to:
 * 1) sets DOM's set value for DOM <html lang="value">.
 * 2) set language to localStorage with key ['i18nSelect:active'].
 * LocalStorage value is loaded by plugin if browser is reloaded.
 */
export let i18nSelectVuexPlugin = store => {
  store.subscribe(mutation => {
    if (mutation.type === setLanguage) {
      document.documentElement.lang = mutation.payload
      localStorage.setItem(localStorageKey, mutation.payload)
    }
  })
}
