import Vue from 'vue'
import Vuex from 'vuex'
import {
  storeModule as i18nSelect,
  i18nSelectVuexPlugin
} from './plugins/i18n-select-plugin'

/**
 * Needed for store instance access.
 */
let store

const state = {
  ioConnected: false,
  ioId: null,
  ioId_prev: null
}

/**
 * M_IO_ prefix significates vue-socket.io events.
 * Mixed casing, because vue-socket.io plugin will us lowercase event=>mutation name!
 */
const socketIOEvents = {
  M_IO_connect: s => {
    s.ioConnected = true
    s.ioId = store._vm.$socket.id
  },
  M_IO_disconnect: s => {
    s.ioConnected = false
    s.ioId_prev = s.ioId
  }
}

const mutations = {}

Vue.use(Vuex)

store = new Vuex.Store({
  strict: true,
  state,
  mutations: { ...mutations, ...socketIOEvents },
  modules: { i18nSelect },
  plugins: [i18nSelectVuexPlugin]
})

export default store

/*
 * https://alligator.io/vuejs/vuex-pathify/
 * https://alligator.io/vuejs/vuex-persist-state/
 */
