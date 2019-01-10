<template>
  <footer
    id="app-footer"
    class="footer is-size-7 is-paddingless"
    @click="quickDashRevelaed=!quickDashRevelaed"
  >
    <div class="container">
      <section class="permanent columns is-mobile">
        <div class="column is-4 is-offset-4 is-paddingless has-text-centered">
          <span class="copyright">
            Copyright&nbsp;©&nbsp;&nbsp;{{years}}&nbsp;&nbsp;Powered by
            <a
              href="https://vuejs.org"
              target="_blank"
            >
              <img class="vue-logo" src="../assets/logo_vue.png">
            </a>
          </span>
        </div>
        <div class="column is-1 is-offset-3 is-paddingless has-text-centered">
          <span class="icon" :title="apiLostIconTitle">
            <span class="fa-stack fa-lg">
              <f-a class="fa-stack-1x" icon="cloud" :class="{'has-text-success': !apiLost}"/>
              <f-a class="fa-stack-1x has-text-danger" icon="ban" v-if="apiLost"/>
            </span>
          </span>
        </div>
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
    </div>
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
    },
    apiLost() {
      return this.$store.state.apiConnected === false
    },
    apiLostIconTitle() {
      return this.apiLost ? 'Puudub ühendus serveriga!' : 'Ühendatud serveriga'
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
// Ensure that main content and bottom-fixed footer will always have some gap.
// Remove it, in case footer is not fixed to bottom anymore.
.app-content {
  margin-bottom: 30px !important;
}
</style>

<style lang="scss">
#app-footer {
  position: fixed;
  bottom: 0;
  left: 0px;
  right: 0px;
  border-top-left-radius: $header-footer-border-radius;
  border-top-right-radius: $header-footer-border-radius;
  border-top: $header-footer-border;
  transition: 0.5s color;
  transition: 0.5s background-color;
  z-index: 30;
  line-height: 1.5;
  .permanent {
    margin: 10px 0;
    .fa-stack {
      height: 0.7rem;
    }
    .copyright {
      vertical-align: middle;
      .vue-logo {
        width: 16px;
        vertical-align: middle;
      }
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
