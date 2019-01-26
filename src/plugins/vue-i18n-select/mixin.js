import { setLanguage } from './constants'

/**
 * This mixin is applied by default for VueI18nSelect SFC.
 * If Vue plugin install gets option `global: true`, then computed will be applied globally.
 */
const i18SelectMixin = {
  computed: {
    $language: {
      get() {
        return this.$store.state.i18nSelect.active
      },
      set(lang) {
        this.$store.commit(setLanguage, lang)
      }
    }
  }
}
export default i18SelectMixin
