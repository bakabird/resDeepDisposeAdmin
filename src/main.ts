import Vue from 'vue'
import App from './App.vue'
import store from './store'
import izoneVue from './izoneVue'
import './style/style.scss'

Vue.use(izoneVue)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
