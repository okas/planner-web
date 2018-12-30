<template>
  <footer class="footer has-text-centered" @click="quickDashRevelaed=!quickDashRevelaed">
    <section class="permanent">
      Copyright&nbsp;©&nbsp;&nbsp;{{years}}&nbsp;&nbsp;Powered by
      <a
        href="https://vuejs.org"
        target="_blank"
      >
        <img class="vue-logo" src="../assets/logo_vue.png">
      </a>
    </section>
    <!--     <section v-if="quickDashRevelaed" class="debug tags has-addons">
      <div class="tag is-white">
        <b>SocketIO Client ID:&nbsp;</b>
        <span v-text="ioId" :class="ioIdClass"/>
      </div>
      <div :class="ioIsNewClass" class="tag is-rounded">
        <b v-text="ioIsNew"/>
      </div>
    </section>-->
  </footer>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'
// const { mapState } = createNamespacedHelpers('irrigation')
// const debug = process.env.NODE_ENV !== 'production'

export default {
  data() {
    return {
      quickDashRevelaed: false
    }
  },
  computed: {
    years() {
      const startYear = 2017
      const currentTear = new Date().getFullYear()
      return currentTear !== startYear
        ? `${startYear}-${currentTear}`
        : startYear
    }
    // ...mapState({
    //   ioId: s => s.ioId || 'n/a',
    //   ioIdClass: s => (s.ioId ? '' : 'has-text-danger'),
    //   ioIsNew: s => (s.ioId !== s.ioId_prev ? 'new' : 'old'),
    //   ioIsNewClass: s => (s.ioId !== s.ioId_prev ? 'is-success' : 'is-danger')
    // })
  }
}
</script>

<style lang="scss">
.app-content {
  margin-bottom: 45px;
}
</style>

<style lang="scss">
.footer {
  font-size: 0.75em;
  position: fixed;
  bottom: 0;
  width: 100%;
  // left: 0px;
  // right: 0px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  border-top: 1px solid #3e1b1b;
  transition: 0.5s color;
  transition: 0.5s background-color;
  .permanent {
    margin: 10px 0;

    .vue-logo {
      width: 16px;
      vertical-align: middle;
    }
  }
  //   .debug.tags {
  //     justify-content: center;
  //     &:last-child {
  //       margin-bottom: -3px;
  //     }
  //   }
}
</style>
