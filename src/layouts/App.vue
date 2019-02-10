<template>
  <div id="app">
    <NavTop />
    <RouterView class="app-content section" />
    <Footer />
  </div>
</template>

<script>
import NavTop from '../components/AppNavTop.vue'
import Footer from '../components/AppFooter.vue'

export default {
  components: { NavTop, Footer }
}
</script>

<style lang="scss">
.router-link-active {
  text-shadow: 0px 0px 20px #269294;
}
.router-link-exact-active {
  text-shadow: 0px 0px 20px #00f9ff;
}
.component-header {
  margin: 0 0 3rem;
}
</style>
