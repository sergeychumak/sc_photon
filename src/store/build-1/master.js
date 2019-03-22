import axios from 'axios'
import i18n from '@/lang/lang'

const state = {

}

const getters = {}

const actions = {

  /**
   * получение урл по ключу из api
   * */
  get_url: ({rootState}, inData) => {
    return new Promise((resolve, reject) => {
      var url = inData.url
        .split('.')
        .reduce(function (state_, a_) {
          return state_[a_]
        }, rootState.api.v1)

      if (url){
        resolve(rootState.api.server + url)
      }else{
        reject(inData.url + " ::: not found")
      }
    })
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
