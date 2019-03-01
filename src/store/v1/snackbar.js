import axios from 'axios'

const defaultState = {
  show: false,
  color: "blue",
  timeout: 5000,
  text: ""
}

const state = {
  data: {}
}

const getters = {
  data: state => { return state.data }
}

const actions = {

  show: ({commit}, inData) => {

    commit('hide')

    setTimeout(function(){
      inData.show = true
      if (inData.type === 'error'){
        inData.color = "red"
      }
      commit('show', inData)
   },100)

  },
  hide: ({commit}) => {
    commit('hide')
  }

}

const mutations = {
  show:  (state, inData) => {
    state.data = Object.assign( {}, defaultState, inData)
  },
  hide:  (state) => {
    state.data = Object.assign( {}, state.data, defaultState)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
