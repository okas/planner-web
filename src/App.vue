<template>
  <div id="app">
    <app-top-nav/>
    <router-view id="app-content"/>
    <app-footer id="app-footer"/>
  </div>
</template>

<script>
import AppTopNav from './components/AppTopNav.vue'
import AppFooter from './components/AppFooter.vue'
export default {
  name: 'App',
  components: { AppTopNav, AppFooter },
  head: {
    link() {
      // Move to main.js or somewhere when it gets rendered in server rather than in browser
      return ['16', '32'].map(this.getFaviconModel)
    }
  },
  methods: {
    getFaviconModel(size) {
      let sxs = `${size}x${size}`
      return {
        rel: 'shortcut icon',
        href: require(`./assets/favicon-${sxs}.png`),
        sizes: sxs,
        type: 'image/png',
        undo: false
      }
    }
  }
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
