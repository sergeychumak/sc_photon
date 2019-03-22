import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import i18n from './lang/lang'
import axios from 'axios'
Vue.use(Vuetify)

Vue.config.productionTip = false

import 'vuetify/dist/vuetify.min.css'

const PHOTOSTUDIO = localStorage.getItem('PHOTOSTUDIO')
if (PHOTOSTUDIO) {
  const token = JSON.parse(PHOTOSTUDIO).auth.token.access
  const type = JSON.parse(PHOTOSTUDIO).auth.token.type
  axios.defaults.headers.common['Authorization'] = type + token
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {App},
  template: '<App/>'
})
