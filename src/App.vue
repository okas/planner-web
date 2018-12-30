<template>
  <div id="app" class>
    <app-top-nav/>
    <router-view class="app-content"/>
    <app-footer/>
  </div>
</template>

<script>
import AppTopNav from './components/AppTopNav.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  components: { AppTopNav, AppFooter }
}
</script>

<style lang="scss">
@import './assets/global_imports.scss';
#app {
  font-family: $family-sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $default-text-color;
}
.router-link-active {
  text-shadow: 0px 0px 20px #269294;
}
.router-link-exact-active {
  text-shadow: 0px 0px 20px #00f9ff;
}
</style>
