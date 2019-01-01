<template>
  <div id="app" class>
    <AppNavTop class="section"/>
    <RouterView class="app-content section"/>
    <AppFooter class="section"/>
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
.router-link-active {
  text-shadow: 0px 0px 20px #269294;
}
.router-link-exact-active {
  text-shadow: 0px 0px 20px #00f9ff;
}
</style>
