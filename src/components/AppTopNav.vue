<template>
  <nav id="app-top-nav">
    <router-link to="/" exact>Kodu</router-link>&nbsp;|
    <router-link to="/devices/" replace>Seadmed</router-link>
  </nav>
</template>

<style lang="scss">
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
