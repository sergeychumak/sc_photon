import axios from 'axios'

const state = {



}

const getters = {}

const actions = {

  download : ({dispatch, rootState}, inData) => {

    var 
      f = true,
      link = rootState.api.server + rootState.api.retouch.download,
      addStringPhotographerUserCodeList = "photographerUserCodeList=",
      addStringWareCardCodeList = "wareCardCodeList="
    
    if (inData.photographerUserCodeList && inData.photographerUserCodeList.length > 0){
      addStringPhotographerUserCodeList = addStringPhotographerUserCodeList + inData.photographerUserCodeList.join("&photographerUserCodeList=")
    }else{
      f = false
    }

    if (inData.wareCardCodeList && inData.wareCardCodeList.length > 0){
      addStringWareCardCodeList = addStringWareCardCodeList + inData.wareCardCodeList.join("&wareCardCodeList=")
    }else{
      f = false
    }

    if (f){

      // axios ({
      //   url: rootState.api.server + rootState.api.wareCard.updateWareCardColorModel,
      //   data: inData,
      //   method: 'POST'
      // })
      //   .then (res=>{
      //
      //     // resolve(res)
      //   })

      link =
        rootState.api.server + rootState.api.retouch.download +
        '?' + addStringPhotographerUserCodeList +
        '&' + addStringWareCardCodeList
      window.open(link, '_blank');
    }

  },

  upload : ({dispatch, rootState}, inData) => {

      dispatch('snackbar/show', {
        text: "Начинаем загрузку файлов"
      }, {root:true})

      dispatch('_upload_file', {
        data: inData,
        index: 0
      }).then(()=>{
        dispatch('snackbar/show', {
          text: "Загрузка закончена"
        }, {root:true})

      })

  },

  _upload_file : ({dispatch, rootState}, inData) => {

      dispatch('snackbar/show', {
        text: "Загружаем: " + inData.data[inData.index].name
      }, {root:true})

     return new Promise((resolve, reject) => {

       let data = new FormData();
       data.append('file', inData.data[inData.index]);

       let options = {
         method: 'POST',
         url: rootState.api.server + rootState.api.retouch.upload,
         headers: {'Content-Type': 'multipart/form-data;'},
         data
       };

       axios(options).then(res => {

         setTimeout(()=>{

           if ( inData.index === inData.data.length - 1){
             resolve()
           }else{

             setTimeout(()=>{
               dispatch('_upload_file', {
                 data: inData.data,
                 index: inData.index + 1
               }).then(()=>{
                 resolve()
               })
             }, 750)


           }

         },750)

       })

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
