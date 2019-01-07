import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rdd: false,
    revising: false,
    revisingObj: {
    },
    singleLineHeight: 0
  },
  mutations: {
    rddIsGod(state) {
      state.rdd = true
    },
    revising(state, payload) {
      state.revising = true
      state.revisingObj = payload
    },
    reviseOver(state) {
      state.revising = false
      state.revisingObj = {}
    },
    updateSingleLH(state, payload) {
      state.singleLineHeight = payload
    }
  },
  actions: {

  }
})
