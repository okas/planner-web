<template>
  <nav
    id="app-top-nav"
    class="navbar is-fixed-top is-dark"
    aria-label="main navigation"
    :class="scroll"
  >
    <div class="navbar-brand">
      <router-link class="navbar-item is-tab" to="/" exact>
        <span class>Saar</span>
        <img class="app_logo" src="../assets/logo_tk.png">
      </router-link>
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
    <div id="navbar-menu" class="navbar-menu" :class="activeCls">
      <div class="navbar-start">
        <router-link class="navbar-item is-tab" to="/devices">Seadmed</router-link>
      </div>
      <div class="navbar-end">
        <router-link class="navbar-item is-tab" to="/about">Info</router-link>
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

<style lang="scss">
#app-top-nav {
  // border: 1px solid #bcedef;
  // border-bottom-left-radius: 15px;
  // border-bottom-right-radius: 15px;
  // box-shadow: inset 0px 0px 20px 8px #c5deff;
  .navbar-item,
  .navbar-item > * {
    font-weight: bold;
    // color: #2c3e50;
    &.router-link-active {
      color: #42b983;
    }
  }
  // .app_logo {
  //   height: 40px;
  // }
  .title {
    vertical-align: middle;
  }
}
</style>
