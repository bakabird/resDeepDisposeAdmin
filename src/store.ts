import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rdd: true,
  },
  mutations: {
    rddIsGod(state) {
      state.rdd = true
    }
  },
  actions: {

  }
})
