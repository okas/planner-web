<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Kodu</router-link>|
      <router-link to="/lights">Tuled</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
