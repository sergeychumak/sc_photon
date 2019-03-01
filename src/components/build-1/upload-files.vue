<template>
  <div class="uploadBox">
    <h3>{{headerMessage}}</h3>

    <form role="form" enctype="multipart/form-data" @submit.prevent="onSubmit">
      <div class="uploadBoxMain" v-if="itemsAdded===0">
        <div class="form-group">
          <div
            class="uploadBoxMain__dropArea"
            @ondragover="onChange"
            :class="dragging ? 'uploadBoxMain__dropArea_drag' : ''"
            @dragenter="dragging=true"
            @dragend="dragging=false"
            @dragleave="dragging=false"
          >
            <h3>{{dropAreaPrimaryMessage}}</h3>
            <h6>{{dropAreaSubPrimaryMessage}}</h6>
            <input type="file" id="items" name="items[]" required multiple @change="onChange">
          </div>
        </div>
      </div>
      <div class="uploadBoxMain uploadBoxMain_color_black" v-else>
        <p><strong>{{totalFileMessage}}</strong> {{itemsAdded}} ( {{itemsTotalSize}} )</p>
        <ol>
          <li v-for="(name,index) in itemsNames">
            {{name}}  <span class="caption">...{{itemsSizes[index]}}</span>
          </li>
        </ol>
      </div>
      <div>

    <v-layout>
      <v-flex>
        <v-btn
          :loading="loading"
          type="submit"
          class="primary"
          :disabled="itemsAdded < minItems || itemsAdded > maxItems"
        >{{uploadButtonMessage}}</v-btn>

        <v-btn
          flat
          type="button"
          @click="removeItems"
        >{{cancelButtonMessage}}</v-btn>
      </v-flex>
      <v-flex shrink>
        <v-btn
          v-if="closeButton"
          flat
          type="button"
          color="red"
          @click="close"
        >{{closeButtonMessage}}</v-btn>
      </v-flex>
    </v-layout>


      </div>
      <div class="successMsg" v-if="successMsg !== ''">{{successMsg}}</div>
      <div class="errorMsg" v-if="errorMsg !== ''">{{fileUploadErrorMessage}}:<br>{{errorMsg}} <br>{{retryErrorMessage}}</div>
      <div class="errorMsg" v-if="itemsAdded && itemsAdded < minItems">{{minFilesErrorMessage}}: {{minItems}}.  <br>{{retryErrorMessage}} </div>
      <div class="errorMsg" v-if="itemsAdded && itemsAdded > maxItems">{{maxFilesErrorMessage}}: {{maxItems}}.  <br>{{retryErrorMessage}}</div>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: "upload-files-container",
    props: {
      method: {
        type: String,
        default: 'post'
      },
      postURL: {
        type: String,
        required: true
      },
      postHeader:{
        type: [Object],
        default: () => {}
      },
      minItems: {
        type: Number,
        default: 1
      },
      maxItems: {
        type: Number,
        default: 100
      },
      headerMessage: {
        type: String,
        default: "Загрузка файлов"
      },
      uploadButtonMessage: {
        type: String,
        default: 'Загрузить'
      },
      cancelButtonMessage: {
        type: String,
        default: 'Отмена'
      },
      closeButtonMessage: {
        type: String,
        default: 'Закрыть'
      },
      fileUploadErrorMessage: {
        type: String,
        default: 'Произошла ошибка'
      },
      retryErrorMessage: {
        type: String,
        default: 'Пожалуйста, удалите файлы и попробуйте снова'
      },
      minFilesErrorMessage: {
        type: String,
        default: 'Минимум файлов, которые нужно добавить'
      },
      maxFilesErrorMessage:  {
        type: String,
        default: 'Максимум файлов, которые можно добавить'
      },
      dropAreaPrimaryMessage: {
        type: String,
        default: 'Перетащите файлы сюда'
      },
      dropAreaSubPrimaryMessage: {
        type: String,
        default: 'или нажмите для выбора'
      },
      totalFileMessage: {
        type: String,
        default: 'Всего файлов:'
      },
      closeButton: {
        type: Boolean,
        default: true
      },
      wareCardCode: {
        type: Number,
        required: true
      },
    },
    data() {
      return {
        items: [],
        itemsAdded: 0,
        itemsNames: [],
        itemsSizes: [],
        itemsTotalSize: 0,
        successMsg: '',
        errorMsg: '',
        dragging: false,
        loading: false
      };
    },
    watch: {

    },
    methods: {
      close: function(){
        this.$emit('update:showUploadBlock', false)
      },
      removeItems: function(){
        this.items = [];
        this.itemsAdded = 0;
        this.itemsNames = [];
        this.itemsSizes = [];
        this.itemsTotalSize = 0;
        this.dragging = false
      },
      bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i === 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
      },
      onChange(e) {
        this.successMsg = '';
        this.errorMsg = '';
        let fileSizes = 0;
        let files = e.target.files || e.dataTransfer.files;
        this.itemsAdded = files.length;
        for (let x in files) {
          if (!isNaN(x)) {
            this.items[x] = files[x];
            fileSizes += files[x].size;
            this.itemsNames[x] = files[x].name;
            this.itemsSizes[x] = this.bytesToSize(files[x].size);
          }
        }
        this.itemsTotalSize = this.bytesToSize(fileSizes);
      },

      onSubmit() {

        let count = this.items.length
        let countComplete = 0
        this.loading = true;

        if (this.method === 'post' ) {
          for (let x in this.items) {
            if (!isNaN(x)) {

              var formData = new FormData();
              formData.append('file', this.items[x]);
              formData.append('wareCardCode', this.wareCardCode);
              formData.append('userName', '');

              axios({
                method: this.method,
                url: this.postURL,
                data: formData,
                headers:this.postHeader
              })
                .then(res => {
                  countComplete = countComplete + 1
                  if (count === countComplete){
                    this.loading = false
                    this.close()
                    this.$emit('uploadComplete')
                  }
                })

            }
          }
        }
      },
    },
    computed: {

    }
  };
</script>

<style lang="scss" scoped>

  .uploadBox {
    position: relative;
    background: #ffffff;
    border: 1px dashed #dddddd;
    padding: 1% 2% ;
    margin: 2%;
    color: #cccccc;
    &Main {
      position: relative;
      margin-bottom: 1em;
      margin-right: 1em;
      &__dropArea {
        position: relative;
        width: 100%;
        height: 200px;
        border: 1px dashed #00ADCE;
        text-align: center;
        font-size: 2em;
        padding-top: 60px;

        & > h3 {
          color: #eeeeee;
        }
        & > h6 {
          color: #eeeeee;
        }
        & > input {
          position: absolute;
          cursor: pointer;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        &_drag {
          border: 1px solid #007798;
        }

      }
      &_color_black {
        color: #555;
      }
    }
  }

  form {
    margin-top: 10px;
  }







  /* End drag and drop */
  /* Loader */
  .uploadBox .loader {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    opacity: 0.9;
  }
  .uploadBox .loaderImg {
    border: 9px solid #eee;
    border-top: 9px solid #00ADCE;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  /* End Loader */
  .uploadBox .errorMsg {
    font-size: 2em;
    color: #a94442;
  }
  .uploadBox .successMsg {
    font-size: 2em;
    color: #3c763d;
  }


</style>

