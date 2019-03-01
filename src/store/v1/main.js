import axios from 'axios'
import i18n from '@/lang/lang'

const state = {}

const getters = {}

const actions = {

  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/

  postRequest: ({rootGetters, dispatch}, inData) => {
    return new Promise((resolve, reject) => {
      axios ( {
        url: rootGetters['api/getUrl'](inData.url),
        data: inData.data,
        method: 'POST'
      })
        .then (res=>{
          console.log(88)
          resolve(res.data)
        })
        .catch(error=>{
          console.log(99)
          dispatch('errorHandler',error.response)
          reject()
        })
    })
  },

  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/

  getRequest: ({rootGetters}, inData) => {
    return new Promise((resolve, reject) => {
      var url = rootGetters['api/getUrl'](inData.url)
      if (inData.appData){
        url = url + inData.appData
      }
      axios
      .get(url)
      .then(res=>resolve(res.data))
      .catch(()=>reject());
    })
  },

  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/

  deleteRequest: ({rootGetters, dispatch}, inData) => {
    return new Promise((resolve, reject) => {
      axios ( {
        url: rootGetters['api/getUrl'](inData.url),
        data: inData.data,
        method: 'DELETE'
      })
        .then (res=>resolve(res.data))
        .catch(error=>{
          dispatch('errorHandler',error.response)
          reject()
        })
    })
  },

  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/
  /** ***********************************************************/

  errorHandler: ({rootGetters, dispatch}, error) => {
    var res = {
      "messageCode": "IDontKnow"
    }
    if (error.data){
      if (error.data.messageCode) res.messageCode = error.data.messageCode
    }
    var data = {
      text: i18n.t('messageCode.' + res.messageCode),
      color: "red"
    }
    dispatch('snackbar/show', data, {root:true})
  }

}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
