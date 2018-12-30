<template>
  <nav id="app-top-nav" class="navbar is-light" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/" exact>
        <h2 class>Saar</h2>
        <img class="app_logo" src="../assets/logo_tk.png">
      </router-link>
      <router-link class="navbar-item" to="/devices">Seadmed</router-link>
      <router-link class="navbar-item" to="/about">Info</router-link>
      <!-- <button
        class="navbar-burger burger button"
        role="button"
        aria-expanded="false"
        data-target="navbar-menu"
      >
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
      </button>-->
    </div>
    <!-- <div id="navbar-menu" class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/devices">Seadmed</router-link>
        <router-link class="navbar-item" to="/about">Info</router-link>
      </div>
    </div>-->
  </nav>
</template>

<style lang="scss">
#app-top-nav {
  border: 1px solid #bcedef;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: inset 0px 0px 20px 8px #c5deff;
  .navbar-item,
  .navbar-item > * {
    font-weight: bold;
    color: #2c3e50;
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
