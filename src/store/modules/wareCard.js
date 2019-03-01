import axios from 'axios'

const state = {

}

const getters = {}

const actions = {
  getHeader_: ({rootState}) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.wareCard.header)
        .then(function (res) {
          resolve(res.data)
        })
        .catch(function (error) {
          reject()
        });
    })
  },
  getBody_: ( {rootState} , data ) => {
    let dataJson = {}
    if (data.user){ dataJson.creatorUserCode = data.user }
    if (data.website){ dataJson.gateSitesGroupCode = data.website }

    if (data.rowsLimit){ dataJson.rowsLimit = data.rowsLimit }
    if (data.dateBegin){ dataJson.wareCardCreateDateFrom = (new Date(data.dateBegin)).getTime()  }
    if (data.dateEnd){ dataJson.wareCardCreateDateTo = (new Date(data.dateEnd + ' 23:59:59')).getTime()  }
    if (data.status){ dataJson.wareCardStatusCode = data.status }
    if (data.photographer){ dataJson.photographerUserCode = data.photographer }

    return new Promise( (resolve, reject) => {
      axios ( {
        url: rootState.api.server + rootState.api.wareCard.body,
        data: dataJson,
        method: 'POST'
      } )
        .then ( res => {
          // var qwe = []
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // qwe.push(res.data.data[0])
          // resolve({data:qwe})
          resolve(res.data)
        } )
        .catch(function (error) {
          reject()
        });
    })
  },
  getInfo_: ({rootState}, data) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.wareCard.card.info + data.id)
        .then(function (res) {
          resolve(res.data)
        })
        .catch(function (error) {
          reject()
        });
    })
  },
  getBlocks_: ({rootState}, data) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.wareCard.card.blocks + data.id)
        .then(function (res) {
          resolve(res.data.data)
        })
        .catch(function (error) {
          reject()
        });
    })
  },
  setNewStatus_: ({rootState}, data) => {
    return new Promise((resolve, reject) => {
      //console.log(data);
      resolve()
      axios ( {
        url: rootState.api.server + rootState.api.wareCard.card.setNewStatus,
        data: {
          "photoCodeList" : data.list,
          "photoStatusCode" : data.id

        },
        method: 'POST'
      } )
        .then ( res => {
          resolve()
        } )
    })
  },
  deletePhoto_: ({rootState}, data) => {
    return new Promise((resolve, reject) => {
      axios ( {
        url: rootState.api.server + rootState.api.photo.delete,
        data: {
          "photoCodeList" : data.list
        },
        method: 'DELETE'
      } )
        .then ( res => {
          resolve()
        } )
    })
  },
  createCard_: ({rootState}, data) => {
     return new Promise((resolve, reject) => {
       axios ( {
         url: rootState.api.server + rootState.api.wareCard.card.create['by-' + data.type],
         data: {
           "userName": "",
           "value": data.value,
           "gateSitesGroupName": data.site,
           "ignoreMdmValidation": data.ignoreMdmValidation
         },
         method: 'POST'
       } )
         .then ( res => {
           resolve(res)
         } ).catch( err => {
          reject()
       })
     })
  },


  changeStatusCard_: ({rootState}, inData) => {
    return new Promise((resolve, reject) => {
      axios ( {
        url: rootState.api.server + rootState.api.wareCard.wareCardStatus,
        data: {
          "wareCardCode" : inData.wareCardCode,
          "wareCardStatusCode" : inData.wareCardStatusCode
        },
        method: 'POST'
      } )
        .then ( res => {
          resolve()
        } )
    })
  },

  getWebSite_: ({rootState}) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.webSite.list)
        .then(function (res) {
          resolve(res.data.data)
        })
        .catch(function (error) {
          reject()
        });
    })
  },

  historyImage_ : ({rootState}, inData) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.wareCard.historyImage + inData.photoFileCode )
        .then(function (res) {
          resolve(res.data.data)
        })
        .catch(function (error) {
          reject()
        });
    })
  },

  getWareCardPermissions: ({rootState}, inData) => {
    return new Promise((resolve, reject) => {
      axios
        .get(rootState.api.server + rootState.api.wareCard.getWareCardPermissions + "/" + inData.wareCardInternalNumber )
        .then(function (res) {
          resolve(res)
        })
        .catch(function (error) {
          reject()
        });
    })
  }

}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
