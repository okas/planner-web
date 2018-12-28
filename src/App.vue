<template>
  <div id="app">
    <nav id="app-top-nav">
      <router-link to="/" exact>Kodu</router-link>&nbsp;|
      <router-link to="/devices/" replace>Seadmed</router-link>
    </nav>
    <router-view id="app-content"/>
    <app-footer id="app-footer"/>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter.vue'
export default {
  name: 'App',
  components: { AppFooter },
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
#app-top-nav {
  padding: 30px;
  border: 1px solid #bcedef;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: inset 0px 0px 20px 15px #c5deff;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.is-active {
      color: #42b983;
    }
  }
}
</style>
