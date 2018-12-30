<template>
  <div id="app" class>
    <app-nav-top/>
    <router-view id="app-content" class="has-text-centered has-background-dark"/>
    <app-footer class/>
  </div>
</template>

<script>
import AppNavTop from './components/AppNavTop.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  components: { AppNavTop, AppFooter }
}
</script>

<style lang="scss">
@import './assets/app_imports.scss';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.router-link-active {
  text-shadow: 0px 0px 20px #269294;
}
.router-link-exact-active {
  text-shadow: 0px 0px 20px #00f9ff;
}
</style>
