<template>
  <v-layout column style="border-top: 1px solid #e0e0e0">

    <v-flex class="overflowAuto">

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / Загрузка ретуши
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">

        <v-btn v-if="showUploadContent" @click="uploadFiles" color="primary" small>Загрузить файлы</v-btn>

        <v-btn v-if="showUploadContent" @click="clearFiles" color="red" small outline>Очистить</v-btn>
        <v-btn v-if="!showUploadContent" @click="selectFiles" color="primary" small outline>Выбрать фотографии</v-btn>

        <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
      </div>

      <div class="pa-4">
        <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload"/>
        <span v-if="showUploadContent">
          <h3>Выбрано {{Object.keys(files).length}} файлов.</h3>
          <v-list class="mt-2">
            <v-list-tile v-for="(item,index) in files" :key="item.name">
              <v-list-tile-action><v-icon color="">photo</v-icon></v-list-tile-action>
              <v-list-tile-content><v-list-tile-title v-text="item.name"></v-list-tile-title></v-list-tile-content>
            </v-list-tile>
          </v-list>
        </span>
      </div>
    </v-flex>

  </v-layout>

</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'uploadRetouch',
    data: function(){
      return {
        files: {}
      }
    },
    mounted: function(){

    },
    methods:{
      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest"
      }),

      ...mapActions( "retouch", {
        UPLOAD_FILES: "upload"
      }),

      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      },

      selectFiles(){ this.$refs.files.click() },
      clearFiles(){ this.files = Object.assign({}) },
      handleFilesUpload(evt){ this.files = evt.target.files },

      uploadFiles: function(){
         this.UPLOAD_FILES(this.files)
      }


    },
    computed: {
      showUploadContent: function(){
        return Object.keys(this.files).length > 0
      }
    },
    updated: function(){
      this.$emit('sync-content')
    },
  }

</script>

<style>
  input[type="file"]{
    position: absolute;
    top: -500px;
  }
</style>
