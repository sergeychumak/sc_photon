import axios from 'axios'
import i18n from '@/lang/lang'

const state = {

  loading: false,

  token: {
    type: "",
    access: "",
    refresh: ""
  },

  error: {
    detect: false,
    message: ""
  }

}

const getters = {
  loading: state => state.loading,
  error_detect: state => state.error.detect,
  error_message: state => state.error.message,
  isAuthenticated: state => !!state.token.access
}

const actions = {
  login: ({dispatch, commit }, inData) => {
    return new Promise((resolve, reject) => {

      commit(
        'loading',
        true
      )

      dispatch(
        "master/get_url",
        { url: "auth.login" },
        { root: true }
      )
      .then(url=>{

        axios({
          url: url,
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
            'Content-type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: {
            "userName": inData.username,
            "password": inData.password
          }
        })
        .then(res=>{
          commit('token_access', res.data.data.accessToken)
          commit('token_refresh', res.data.data.refreshToken)
          commit('token_type', res.data.data.type)
          commit('loading', false)
          axios.defaults.headers.common['Authorization'] = res.data.data.type + res.data.data.accessToken
          resolve()
        })
        .catch(error=>{
          commit('error_detect', true)
          commit('error_message', error.response.data.messageCode)
          commit('loading', false)
          reject()
        })
      })
      .catch(res=>{
        console.warn(res)
      })
    })
  },
  logout: ({commit}) => {
    return new Promise((resolve) => {
      const PHOTOSTUDIO = localStorage.getItem('PHOTOSTUDIO')
      if (PHOTOSTUDIO) {
        localStorage.PHOTOSTUDIO = ""
        commit("error_detect")
        commit("error_message")
        commit("token_access")
        commit("token_refresh")
        commit("token_type")
        resolve()
      }
    })
  },
}

const mutations = {
  loading: (state, f) => {
    state.loading = f
  },
  error_detect: (state, f = false) => {
    state.error.detect = f
  },
  error_message: (state, messageCode = '') => {
    let msg = ''
    if (messageCode !== '')
      msg = i18n.t('messageCode.' + messageCode)
      state.error.message = msg
  },
  token_access: (state, token = '') => {
    state.token.access = token
  },
  token_refresh: (state, token = '') => {
    state.token.refresh = token
  },
  token_type: (state, type = '') => {
    state.token.type = type
  }
}

export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
