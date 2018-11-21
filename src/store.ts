import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rdd: false,
    revising: false,
    revisingObj: {
    }
  },
  mutations: {
    rddIsGod(state) {
      state.rdd = true
    },
    revising(state,payload){
      state.revising = true
      state.revisingObj = payload
    },
    overRevise(state){
      state.revising = false
    }
  },
  actions: {

  }
})
