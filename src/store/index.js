import Vue from 'vue'
import Vuex from 'vuex'
import api from "./api"
import wareCard from "./modules/wareCard"
import main from "./v1/main"
import axios from "axios";

import retouch from "./v1/retouch"
import snackbar from "./v1/snackbar"


import master from "./build-1/master"
import auth from "./build-1/auth"

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'PHOTOSTUDIO',
      paths: [
        'auth'
      ]
    })
  ],
  modules: {
    api,
    wareCard,
    main,
    retouch,
    snackbar,
    master,
    auth
  },
  state: {},
  actions: {

    /** Список пользователей *********************/
    USERS_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.users.list )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    /** Список фотогрофов *********************/
    PHOTOGRAPHER_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.photographer.list )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    /** Список статусов КТ *********************/
    STATUS_CARDS_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.cards.status )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    /** Список сайтов *********************/
    WEBSITE_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.webSite.list )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    /** Список сайтов *********************/
    GATE_SITES_GROUP_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.gateSitesGroup )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    /** Список содержание фона *********************/
    CONTENT_BACKGROUND_LIST : ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.contentBackground )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    UPDATE_WEBSITE_LIST : ({rootState}, inData) => {
      return new Promise( (resolve, reject) => {
        axios ( {
          url: rootState.api.server + rootState.api.updateWebSiteList,
          data: inData,
          method: 'POST'
        })
        .then ( res => {
          //console.log(res)
        })
      })
    },

    GET_WEBSITE_LIST: ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getWebSiteList )
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    GET_PERSPECTIVE_LIST_BY_WARECARD: ({rootState}, wareCardCode) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getPerspectiveViewListByWareCard + '/' + wareCardCode)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    GET_PERSPECTIVE_PHOTO_FILE_SUGGESTION_LIST: ({rootState}, wareCardCode) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getPerspectivePhotoFileSuggestionList + '/' + wareCardCode)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    GET_PERSPECTIVE_CHOSEN_PHOTOFILE_LIST: ({rootState}, wareCardCode) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getPerspectiveChosenPhotoFileList + '/' + wareCardCode)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    SAVE_PHOTOFILE_PERSPECTIVE : ({rootState}, inData) => {
      return new Promise( (resolve, reject) => {
        axios ( {
          url: rootState.api.server + rootState.api.savePhotoFilePerspectiveView,
          data: inData,
          method: 'POST'
        })
          .then ( res => {
            //console.log(res)
          })
      })
    },

    GET_USER_SITES_GROUP_LIST: ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getUserSitesGroupList)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

    UPDATE_USER_SITES_GROUP_LIST: ({rootState}, inData) => {
      return new Promise((resolve, reject) => {
        axios({
          url: rootState.api.server + rootState.api.updateUserSitesGroupList,
          data: inData,
          method: 'POST'
        })
          .then(res => {
            //console.log(res)
          })
      })
    },

    GET_USER_SITES_GROUP_LIST_REF: ({rootState}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(rootState.api.server + rootState.api.getUserSitesGroupListRef)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (error) {
            reject()
          });
      })
    },

  },
  mutations: {},
  getters: {}

})

export default store
