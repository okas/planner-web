<template>
  <footer id="app-footer" class="footer is-size-7 is-paddingless">
    <div class="container">
      <section class="permanent columns is-mobile is-marginless">
        <div class="column is-4 is-offset-4 has-text-centered">
          <span class="copyright is-paddingless">
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
          <div class="status">
            <span class="icon" :title="ioIconTitle" @click="quickDashRevelaed=!quickDashRevelaed">
              <span class="fa-stack fa-lg">
                <f-a
                  class="fa-stack-1x"
                  icon="cloud"
                  :class="{'has-text-success': this.ioConnected}"
                />
                <transition name="fade">
                  <f-a class="fa-stack-1x has-text-danger" icon="ban" v-if="!this.ioConnected"/>
                </transition>
              </span>
            </span>
          </div>
        </div>
      </section>
      <transition name="slide-fade">
        <section class="debug has-text-centered" v-if="quickDashRevelaed">
          <div class="tags has-addons">
            <div class="tag is-white">
              <b>SocketIO Client ID:&nbsp;</b>
              <span :class="{'has-text-danger': !this.ioConnected}" v-text="ioIdOrNA"/>
            </div>
            <div class="tag is-rounded" :class="[ioConnected ? 'is-success' : 'is-danger']">
              <b v-text="ioIsNew"/>
            </div>
          </div>
        </section>
      </transition>
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
/*
 * Ensure that main content and bottom-fixed footer will always have some gap.
 * Remove it, in case footer is not fixed to bottom anymore.
 */
.app-content {
  margin-bottom: 30px !important;
}
</style>

<style lang="scss" scoped>
$speed: 0.3s;

.footer {
  position: fixed;
  bottom: 0;
  left: 0px;
  right: 0px;
  border-top-left-radius: $header-footer-border-radius;
  border-top-right-radius: $header-footer-border-radius;
  border-top: $header-footer-border;
  z-index: 30;
  line-height: 1.5;
  .permanent {
    margin: 0.7rem 0;
    .copyright {
      vertical-align: middle;
      .vue-logo {
        width: 16px;
        vertical-align: middle;
      }
    }
    .status {
      .icon {
        .fa-stack {
          .fa-ban {
            &.fade-enter-active,
            &.fade-leave-active {
              transition: opacity $speed;
            }
            &.fade-enter,
            &.fade-leave-to {
              opacity: 0;
            }
          }
        }
      }
    }
  }
  .debug {
    margin-bottom: 0.4rem;
    .tags {
      justify-content: center;
    }
  }
}
</style>
