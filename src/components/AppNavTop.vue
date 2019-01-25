<template>
  <nav
    id="app-top-nav"
    class="navbar is-fixed-top is-black is-paddingless"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand is-mobile">
        <RouterLink class="navbar-item is-tab" to="/" exact>
          Saar
          <img class="app-logo" src="../assets/logo_tk.png">
        </RouterLink>
        <a
          class="navbar-burger burger"
          role="button"
          aria-expanded="false"
          data-target="navbar-menu"
          @click="toggle"
          :class="{'is-active': isActive}"
        >
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
        </a>
      </div>
      <!-- Links from router should be rendered based on rout configuration.
      Like MenuSide component.-->
      <div id="navbar-menu" class="navbar-menu" :class="{'is-active': isActive}">
        <div class="navbar-start">
          <RouterLink class="navbar-item is-tab" to="/devices">Seadmed</RouterLink>
        </div>
        <div class="navbar-end">
          <RouterLink class="navbar-item is-tab" to="/about">Info</RouterLink>
          <div class="navbar-item">
            <i18n-select/>
        </div>
      </div>
    </div>
    </div>
  </nav>
</template>

<script>
import I18nSelect from '../plugins/i18n-select-plugin/I18nSelect'

export default {
  components: { I18nSelect },
  data() {
    return {
      isActive: false,
      lastY: 0,
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive
    },
    handleScroll() {
      const y = window.scrollY
      this.lastY = y
    }
  },
  created() {
    document.querySelector('body').classList.add('has-navbar-fixed-top')
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
#app-top-nav * {
  transition: 0.3s all !important;
}
#app-top-nav {
  border-bottom-right-radius: $header-footer-border-radius;
  border-bottom-left-radius: $header-footer-border-radius;
  border-bottom: $header-footer-border;
}
</style>
