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
  const token = JSON.parse(PHOTOSTUDIO).auth.accessToken
  const type = JSON.parse(PHOTOSTUDIO).auth.type
  axios.defaults.headers.common['Authorization'] = type + token
}

// axios.interceptors.response.use((response) => {
//   return response;
// }, function (error) {
//   if (error.response.status === 307) {
//     store
//       .dispatch('auth/refresh')
//       .then(res=>{
//         return Promise.reject(error.response);
//         //console.log( res)
//       })
//   }else{
//
//   }
//
// });



/******************************************  */
/******************************************  */
/******************************************  */
/******************************************  */
// refresh

// let isAlreadyFetchingAccessToken = false
// let subscribers = []
//
// function onAccessTokenFetched(access_token) {
//   subscribers = subscribers.filter(callback => callback(access_token))
// }
//
// function addSubscriber(callback) {
//   subscribers.push(callback)
// }
//
// axios.interceptors.response.use(function (response) {
//   return response
// }, function (error) {
//   const { config, response: { status } } = error
//   const originalRequest = config
//
//   if (status === 307) {
//     if (!isAlreadyFetchingAccessToken) {
//       isAlreadyFetchingAccessToken = true
//       store.dispatch(fetchAccessToken()).then((access_token) => {
//         isAlreadyFetchingAccessToken = false
//         onAccessTokenFetched(access_token)
//       })
//     }
//
//     const retryOriginalRequest = new Promise((resolve) => {
//       addSubscriber(access_token => {
//         originalRequest.headers.Authorization = 'Bearer ' + access_token
//         resolve(axios(originalRequest))
//       })
//     })
//     return retryOriginalRequest
//   }
//   return Promise.reject(error)
// })

/******************************************  */
/******************************************  */
/******************************************  */
/******************************************  */












new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {App},
  template: '<App/>'
})
