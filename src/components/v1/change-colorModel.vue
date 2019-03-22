<template>
  <div>
    <template v-if="!editType">
      <template v-if="colorModel === null"><span class="body-2 red--text">ЦМ отсутствует</span></template>
      <template v-else>{{colorModel}}</template>
      <div v-if="showEditColormodel">
        <a href="" @click.prevent="edit">Изменить</a>
      </div>
    </template>
    <template v-else>
      <v-text-field
        solo
        v-model="form.colorModel"
        persistent-hint
        hide-details
      ></v-text-field>
      <div class="red--text mt-1" v-if="errors.ware_color_model_not_found">Цветомодель не найдена</div>
      <v-btn small icon @click="save" flat :loading="loading">
        <v-icon small >save</v-icon>
      </v-btn>
      <v-btn small icon @click="close" color="error" flat :disabled="loading">
        <v-icon small>close</v-icon>
      </v-btn>
    </template>
    <v-alert :value="errorsFlag" type="error">
      {{errorsMessage}}
    </v-alert>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  export default {
    name: 'change-colorModel-component',
    props:{
      wareCardCode: {
        type: Number
      },
      colorModel: {
        type: String
      },
      showEditColormodel: {
        type: Boolean,
        default: false
      }
    },
    data: function(){
      return {
        loading: false,
        editType: false,
        form: {
          colorModel: null
        },
        errors: {
          ware_color_model_not_found: false
        },

        errorsFlag: false,
        errorsMessage: ""

      }
    },
    methods: {

      ...mapActions( "wareCardController", {
        updateWareCardColorModel: "updateWareCardColorModel"
      }),

      close: function () {
        this.form.colorModel = null
        this.editType = false
        this.errorsFlag = false
      },
      edit: function () {
        this.editType = true
      },
      save: function () {

        this.loading = true

        this.updateWareCardColorModel({
            "wareCardCode": this.wareCardCode,
            "wareCardColorModel": this.form.colorModel
        })
        .then(
          ()=>{
            this.editType = false
            this.loading = false
            this.errorsFlag = false
          },
          (e) => {
            this.loading = false
            this.errorsFlag = true
            this.errorsMessage = this.$t('messageCode.'+ e.data.messageCode)
          }
        )
        

      }
    },
    watch: {
      editType: function (newValue) {
        if (newValue){
          this.form.colorModel = this.colorModel
        }
      }
    }
  }
</script>

