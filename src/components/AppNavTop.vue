<template>
  <nav
    id="app-top-nav"
    class="navbar is-fixed-top is-black is-paddingless"
    aria-label="main navigation"
    :class="scroll"
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
          :class="activeCls"
        >
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
        </a>
      </div>
      <!-- Links from router should be rendered based on rout configuration.
      Like MenuSide component.-->
      <div id="navbar-menu" class="navbar-menu" :class="activeCls">
        <div class="navbar-start">
          <RouterLink class="navbar-item is-tab" to="/devices">Seadmed</RouterLink>
        </div>
        <div class="navbar-end">
          <RouterLink class="navbar-item is-tab" to="/about">Info</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
      lastY: 0,
      scroll: ''
    }
  },
  computed: {
    activeCls() {
      return this.isActive ? 'is-active' : ''
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive
    },
    handleScroll() {
      const y = window.scrollY
      this.scroll = y > this.lastY ? 'scrollUp' : ''
      this.lastY = y
    }
  },
  watch: {
    $route() {
      this.isActive = false
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
