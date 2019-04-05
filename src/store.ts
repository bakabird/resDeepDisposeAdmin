import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rdd: false,
    revising: false,
    goldsOnPlate: '',
    plateName: '',
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
    updateGoldsOnPlate(state, payload) {
      state.goldsOnPlate = payload
    },
    updatePlateName(state, payload) {
      state.plateName = payload
    },
    updateSingleLH(state, payload) {
      state.singleLineHeight = payload
    }
  },
  actions: {

  }
})
