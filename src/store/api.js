const state = {
  server: "",

  // v1
  "v1":{

    "account-controller" : {
      "createAccount": "api/account",
      "updateAccount": "api/account",
      "getCurrentAccountUser": "api/account/current",
      "updatePassword": "api/account/password",
      "getAccountUserPhotographerList": "api/account/photographer/table/body",
      "getAccountUserRetoucherList": "api/account/retoucher/table/body",
      "getAccountUserList": "api/account/table/body",
      "getAccountUserTableHeader": "/api/account/table/header"
    },
    "account-role-controller" : {
      "getRoleList": "api/account/role/table/body"
    },
    "ref-controller": {
      "getContentBackgroundList": "api/ref/contentBackground/table/body",
      "getContentSourceList": "api/ref/contentSource/table/body",
      "updateParamList": "api/ref/parameter",
      "getParam": "api/ref/parameter",
      "getParamList": "api/ref/parameter/table/body",
      "getPerspectiveViewListByWareCard": "api/ref/perspectiveView/table/body",
      "getWareCardStatusList": "api/ref/wareCardStatus/table/body"
    },

    "ware-card-controller": {
      "getWareCardDetail": "api/wareCard/detail",
      "deleteRetouchingSample": "api/wareCard/retouchingSample",
      "getRetouchingSampleList": "api/wareCard/retouchingSample",
      "getWareCardList": "api/wareCard/table/body",
      "getWareCardTableHeader": "api/wareCard/table/header",
      "createWareCardByArticleNumber": "api/wareCard/wareCardByArticleNumber",
      "createWareCardByBarCode": "api/wareCard/wareCardByBarCode",
      "createWareCardByColorModel": "api/wareCard/wareCardByColorModel",
      "createWareCardByExternalGUID": "api/wareCard/wareCardByExternalGUID",
      "createWareCardByInternalGUID": "api/wareCard/wareCardByInternalGUID",
      "updateWareCardColorModel": "api/wareCard/WareCardColorModel",
      "updateWareCardStatus": "api/wareCard/wareCardStatus"
    },
    "retouch-controller":{
      "validateZipFileRequest": "api/retouch/zipFile/request/validate",
      "getRetouchZipFile": "api/retouch/zipFile"
    },
    "photo-controller": {
      "getPhotoBlockList": "api/photo/block/table/body"
    },






    "auth": {
      "login": "api/auth/login",
      "refresh": "api/auth/token/refresh"
    },

    "ref": {
      "getContentBackgroundList" : "api/ref/contentBackground/table/body"
    },

    "account": {
      "list": "api/account/table/body",
      "photographerList": "api/account/photographer/table/body",
      "tableHeader": "api/account/table/header",
      "tableBody": "api/account/table/body",
      "getCurrentAccountUser": "api/account/current" // GET
    },
    "wareCard": {
      "status": "api/ref/wareCardStatus/table/body",
      "setStatus": "api/wareCard/wareCardStatus",
      "tableHeader": "api/wareCard/table/header",
      "tableBody": "api/wareCard/table/body",
      "create" : {
        "by-article": "api/wareCard/wareCardByArticleNumber",
        "by-code": "api/wareCard/wareCardByBarCode",
        "by-colormodel": "api/wareCard/wareCardByColorModel",
        "by-guid": "api/wareCard/wareCardByInternalGUID"
      },
      "update": {
        "colorModel": "api/wareCard/WareCardColorModel"
      },
      "detail": "api/wareCard/detail",
      "blocks": "api/photo/block/table/body"
    },
    "gateSitesGroup": {
      "list": "api/ref/gateSitesGroup/table/body"
    },
    "zipFile": {
      "retouch": {
        "validate": "api/retouch/zipFile/request/validate",
        "get": "api/retouch/zipFile"
      }
    },
    "image": {
      "history" : "api/photo/file/history/table/body",
      "setMain": "api/photoFile/photoFile/main",
      "delete" : "api/photo",
      "setNewStatus": "api/photo/photoStatus"
    },
    "perspective" : {
      "view": "api/ref/perspectiveView/table/body",
      "suggestion": "api/perspective/photoFileSuggestion/table/body",
      "chosen": "api/perspective/chosenPhotoFile/table/body",
      "save": "api/perspective/photoFilePerspectiveView"
    },
    "site": {
      "group": "api/mdm/gateSitesGroup/table/body",
      "list": "api/ref/gateSitesGroup/table/body",
      "userSitesGroup": "api/ref/userSitesGroup/table/body",
      "getUserSitesGroup": "api/mdm/userSitesGroup/table/body",
      "updateWebSiteList": "api/ref/gateSitesGroup",
      "updateUserSitesGroupList": "api/ref/userSitesGroup",
    },
    "background": {
      "list": "api/mdm/contentBackground/table/body"
    }
  },
  // -------------
  // -------------
  // -------------
  // -------------
  // -------------

  "retouch": {
    "download": "api/retouch/zipFile",
    "upload": "api/photoFile/photoFile"
    // "upload": "api/photoFile/photoFileTest"
  },

  wareCard: {



    "updateWareCardColorModel": "api/wareCard/WareCardColorModel",

    "wareCardStatus": "api/wareCard/wareCardStatus",
    "historyImage": "api/photo/file/table/body/",


    header: "api/wareCard/table/header",
    body: "api/wareCard/table/body",
    "card": {
      "info": "api/wareCard/detail/",
      "blocks": "api/photo/block/table/body/",
      "photo": "api/photoFile/photoFile/",
      "setNewStatus": "api/photo/photoStatus",
      "create" : {
        "by-article": "api/wareCard/wareCardByArticleNumber",
        "by-code": "api/wareCard/wareCardByBarCode",
        "by-colormodel": "api/wareCard/wareCardByColorModel",
        "by-guid": "api/wareCard/wareCardByInternalGUID"
      }
    },
    "downloadZip" : "api/retouch/zipByWareCard",
  },
  "photo": {
    "delete" : "api/photo/"
  },
  "webSite": {
    "list": "api/ref/gateSitesGroup/table/body"
  },

  "users": {
    "list": "api/account/table/body"
  },
  "photographer": {
    "list": "api/account/photographer/table/body"
  },
  "cards": {
    "status": "api/ref/wareCardStatus/table/body"
  },

  // /**
  //   Получить статусы, куда можно перводить карточку в зависимости от текущего статуса.
  //   api/ref/wareCardStatusWorkFlow/table/body/{wareCardStatusCode}
  // */
  // "wareCardStatusWorkFlow" : "api/ref/wareCardStatusWorkFlow/table/body"

  "gateSitesGroup": "api/mdm/gateSitesGroup/table/body",
  "contentBackground": "api/mdm/contentBackground/table/body",
  "updateWebSiteList": "api/ref/gateSitesGroup",
  "getWebSiteList": "api/ref/gateSitesGroup/table/body",
  "getPerspectiveViewListByWareCard": "api/ref/perspectiveView/table/body", // Список ракурсов для карточки (справочник)
  "getPerspectivePhotoFileSuggestionList": "api/perspective/photoFileSuggestion/table/body", // Фото, которым можно назначить ракурс
  "getPerspectiveChosenPhotoFileList": "api/perspective/chosenPhotoFile/table/body", // Фото, которым назначен ракурс
  "savePhotoFilePerspectiveView": "api/perspective/photoFilePerspectiveView", // Сохранить выбранные ракурсы
  "getUserSitesGroupList": "api/mdm/userSitesGroup/table/body",
  "updateUserSitesGroupList": "api/ref/userSitesGroup",
  "getUserSitesGroupListRef": "api/ref/userSitesGroup/table/body"
}

const getters = {
  getUrl: state => key => {
    // default version url api = v1
    let verUrlApi = "v1"
    let url = key.split('.').reduce(function(state_,a_){return state_[a_]}, state[verUrlApi])
    if (url){
      return state.server + url
    }else{
      console.error("Ошибка! Не могу найти url:", key)
      return ""
    }
  }
}

export default {
  namespaced: true,
  state,
  getters
}
