import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiConnected: undefined
  },
  mutations: {
    m_io_connect: s => (s.apiConnected = true),
    m_io_disconnect: s => (s.apiConnected = false)
  },
  actions: {}
})
