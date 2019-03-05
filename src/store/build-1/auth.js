import axios from 'axios'
import i18n from '@/lang/lang'

const state = {
  inProcess: false,
  accessToken: "",
  refreshToken: "",
  type: "",


  error: false,
  errorText: ""
}

const getters = {
  error: state => state.error,
  errorText: state => state.errorText,
  isAuthenticated: state => !!state.accessToken,
  inProcess: state => state.inProcess
}

const actions = {
  login: ({dispatch, commit }, inData) => {
    return new Promise((resolve, reject) => {

      dispatch('toggleInProcess')

      dispatch( "master/get_url", { url: "auth.login" }, { root: true } )
        .then(url=>{

          let options = {
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
          };

          axios(options)
            .then(res => {
              commit("set_errors")
              commit("set_accessToken", res.data.data.accessToken)
              commit("set_refreshToken", res.data.data.refreshToken)
              commit("set_type", res.data.data.type)
              dispatch('toggleInProcess')
              axios.defaults.headers.common['Authorization'] = res.data.data.type + res.data.data.accessToken
              resolve()
            })
            .catch(error=>{
              commit("set_errors", error.response.data.messageCode)
            })

        })

    })
  },
  
  logout: ({commit}) => {
    return new Promise((resolve) => {
      const PHOTOSTUDIO = localStorage.getItem('PHOTOSTUDIO')
      if (PHOTOSTUDIO) {
        localStorage.PHOTOSTUDIO = ""
        commit("set_errors")
        commit("set_accessToken", "")
        commit("set_refreshToken", "")
        commit("set_type", "")
        resolve()
      }
    })
  },
  toggleInProcess: ({commit}) => {
    commit('toggleInProcess')
  }
}

const mutations = {
  set_errors: (state, errorType = null) => {
    if (errorType){
      state.error = true
      state.errorText = i18n.t('messageCode.' + errorType)
    }else{
      state.error = false
      state.errorText = ""
    }
  },
  set_accessToken: (state, data) => { state.accessToken = data },
  set_refreshToken: (state, data) => { state.refreshToken = data },
  set_type: (state, data) => { state.type = data },
  toggleInProcess: (state) => { state.inProcess = !state.inProcess }
}

export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
