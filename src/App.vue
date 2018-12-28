<template>
  <div id="app">
    <app-top-nav/>
    <router-view id="app-content"/>
    <app-footer/>
  </div>
</template>

<script>
import AppTopNav from './components/AppTopNav.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  name: 'App',
  components: { AppTopNav, AppFooter }
}
</script>

<style lang="scss">
@import '@globalImpScss';
#app {
  font-family: $family-sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $default-text-color;
}
</style>
