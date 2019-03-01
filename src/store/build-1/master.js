import axios from 'axios'
import i18n from '@/lang/lang'

const state = {}

const getters = {}

const actions = {
  get_url: ({rootState}, inData) => {
    return new Promise((resolve) => {
      var url = inData.url
        .split('.')
        .reduce(function (state_, a_) {
          return state_[a_]
        }, rootState.api.v1)
      resolve(rootState.api.server + url)
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
