<template>
  <footer id="app-footer" class="footer is-size-7 is-paddingless">
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
          <span class="icon" :title="ioIconTitle" @click="quickDashRevelaed=!quickDashRevelaed">
            <span class="fa-stack fa-lg">
              <f-a
                class="fa-stack-1x"
                icon="cloud"
                :class="{'has-text-success': this.ioConnected}"
              />
              <f-a class="fa-stack-1x has-text-danger" icon="ban" v-if="!this.ioConnected"/>
            </span>
          </span>
        </div>
      </section>
      <section class="debug tags has-addons has-text-centered" v-if="quickDashRevelaed">
        <div class="tag is-white">
          <b>SocketIO Client ID:&nbsp;</b>
          <span :class="{'has-text-danger': !this.ioConnected}" v-text="ioIdOrNA"/>
        </div>
        <div class="tag is-rounded" :class="[ioConnected ? 'is-success' : 'is-danger']">
          <b v-text="ioIsNew"/>
        </div>
      </section>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      quickDashRevelaed: false
    }
  },
  computed: {
    years: () => `${2018}-${new Date().getFullYear()}`,
    ioIconTitle() {
      return this.ioConnected
        ? `Ühendatud serveriga, id: [ ${this.ioId} ]`
        : `Puudub ühendus serveriga, id oli: [ ${this.ioId_prev || 'n/a'} ]`
    },
    ...mapState({
      ioId: 'ioId',
      ioId_prev: 'ioId_prev',
      ioConnected: 'ioConnected',
      ioIdOrNA: s => s.ioId || 'n/a',
      ioIsNew: s => (s.ioConnected ? 'new' : 'old')
    })
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

<style lang="scss" scoped>
.footer {
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
  .debug.tags {
    justify-content: center;
    &:last-child {
      margin-bottom: -3px;
    }
  }
}
</style>
