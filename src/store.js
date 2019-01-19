import Vue from 'vue'
import Vuex from 'vuex'

const isDebug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

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
const mutations = {
  M_IO_connect: s => {
    s.ioConnected = true
    s.ioId = store._vm.$socket.id
  },
  M_IO_disconnect: s => {
    s.ioConnected = false
    s.ioId_prev = s.ioId
  }
}

store = new Vuex.Store({
  strict: isDebug,
  state,
  mutations
})

export default store
