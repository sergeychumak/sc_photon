<template>

        <v-container fluid fill-height class="pa-0 ma-0 mt-5">

          <div ref="isHook__Name">
            / Загрузка фотографий от ретушера
          </div>

          <!--ACTION-->
          <div ref="isHook__Actions">
            <v-btn v-if="showUploadContent" @click="clearFiles" color="red" small outline>Очистить</v-btn>
            <v-btn v-if="!showUploadContent" @click="selectFiles" color="primary" small outline>Выбрать фотографии</v-btn>
            <v-btn @click="go2Back" small icon><v-icon>close</v-icon></v-btn>
          </div>

          <v-layout>
            <v-flex>
              <div class="pa-4">
                <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload"/>
                <span v-if="showUploadContent">
                  <h3>Выбрано {{Object.keys(files).length}} файлов.</h3>
                  <v-btn @click="uploadFiles" color="primary" small>Загрузить файлы</v-btn>
                  <v-list class="mt-2">
                    <v-list-tile v-for="(item,index) in files" :key="item.name">
                      <v-list-tile-action><v-icon color="">photo</v-icon></v-list-tile-action>
                      <v-list-tile-content><v-list-tile-title v-text="item.name"></v-list-tile-title></v-list-tile-content>
                      <!--<v-list-tile-avatar >-->
                      <!--<v-icon @click="deleteItemFiles(index)">close</v-icon>-->
                      <!--</v-list-tile-avatar>-->
                    </v-list-tile>
                  </v-list>
                </span>
              </div>
            </v-flex>
          </v-layout>
        </v-container>


</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'retouch-upload-page',
    data () {
      return {
        files: {}
      }
    },
    mounted () {},
    methods: {
      ...mapActions( "retouch", {
        UPLOAD_FILES: "upload"
      }),
      selectFiles(){ this.$refs.files.click() },
      clearFiles(){ this.files = Object.assign({}) },
      handleFilesUpload(evt){ this.files = evt.target.files },
      go2Back: function(){ this.$router.push({name:'list'}) },
      uploadFiles: function(){
        this.$router.push({name:'list'})
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
    watch: {}

  }

</script>

<style>
  input[type="file"]{
    position: absolute;
    top: -500px;
  }
</style>

