<template>
  <v-layout column>

    <v-flex shrink class="pl-3 pt-2 pb-2">
      <v-btn small icon @click="back"><v-icon>arrow_back</v-icon></v-btn>
      <v-btn @click="save" color="blue" :disabled="disabledButtonSave" :dark="!disabledButtonSave" small >Сохранить</v-btn>
    </v-flex>

    <v-flex class="overflowAuto" style="background: #fff"  >

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / Добавление новой карточки
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">
        <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
      </div>

      <div class="pl-4 pt-2 pb-2" style="max-width: 500px;">

        <div class="mt-4">
          <FieldTitleComponent textCode="typeCreate"></FieldTitleComponent>
          <SelectComponent
            :list="typeCreateList"
            itemText="label"
            itemValue="id"
            :currentValue.sync="typeCreateId"
          ></SelectComponent>
        </div>

        <div class="mt-4">
          <FieldTitleComponent textCode="contentBackground"></FieldTitleComponent>
          <AutocompleteComponent
            :list="contentBackgroundList"
            itemText="name"
            itemValue="code"
            :currentValue.sync="contentBackground"
          ></AutocompleteComponent>
        </div>


        <div v-if="typeCreateCode!=='guid'" class="mt-4">
          <FieldTitleComponent textCode="value"></FieldTitleComponent>
           <v-text-field solo v-model="valueData" hide-details></v-text-field>
        </div>

      </div>


    </v-flex>

    <v-flex shrink>
      <v-alert :value="errorFlag" type="error">
        {{errorMessage}}
      </v-alert>
    </v-flex>

  </v-layout>

</template>

<script>
  import {mapActions} from 'vuex'

  import atomSelectComponent from "@/components/atoms/select"
  import atomFieldTitleComponent from "@/components/atoms/fieldTitle"
  import atomAutocompleteComponent from "@/components/atoms/autocomplete"

  export default {
    name: 'add-new-card',
    components: {
      SelectComponent: atomSelectComponent,
      FieldTitleComponent: atomFieldTitleComponent,
      AutocompleteComponent: atomAutocompleteComponent
    },
    data: function(){
      return {
        typeCreateId : null,
        typeCreateList: [
          {id:1, code:"article",label:"По артиклу "},
          {id:2, code:"code",label:"По шрих коду "},
          {id:3, code:"colormodel",label:"По цветомодели "},
          {id:4, code:"guid",label:"По guid "}
        ],

        valueData: "",

        contentBackground: null,
        contentBackgroundList: [],

        errorFlag: false,
        errorMessage: ""

      }
    },
    methods:{

      ...mapActions("wareCardController", {
        createWareCardByArticleNumber: "createWareCardByArticleNumber",
        createWareCardByBarCode: "createWareCardByBarCode",
        createWareCardByColorModel: "createWareCardByColorModel",
        createWareCardByInternalGUID: "createWareCardByInternalGUID"
      }),

      ...mapActions("refController", {
        getContentBackgroundList: "getContentBackgroundList"
      }),


      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      },
      save: function(){

        this.errorFlag = false

        let payload = {
          "contentBackgroundCode": this.contentBackground,
          "ignoreMdmValidation": this.ignoreMdmValidation,
          "value": this.valueData
        }

        switch (this.typeCreateCode) {
          case "article":
            this.createWareCardByArticleNumber(payload)
              .then(()=>{this.back()})
              .catch(messageCode => {
                this.errorFlag = true
                this.errorMessage = this.$t('messageCode.' + messageCode)
              })
          break
          case "code":
            this.createWareCardByBarCode(payload)
              .then(()=>{this.back()})
              .catch(messageCode => {
                this.errorFlag = true
                this.errorMessage = this.$t('messageCode.' + messageCode)
              })
          break
          case "colormodel":
            this.createWareCardByColorModel(payload)
              .then(()=>{this.back()})
              .catch(messageCode => {
                this.errorFlag = true
                this.errorMessage = this.$t('messageCode.' + messageCode)
              })
          break
          case "guid":
            this.createWareCardByInternalGUID(payload)
              .then(()=>{this.back()})
              .catch(messageCode => {
                this.errorFlag = true
                this.errorMessage = this.$t('messageCode.' + messageCode)
              })
          break
        }

      }
    },
    computed: {

      typeCreateCode: function(){
        if ( this.typeCreateId !==null ){
          return this.typeCreateList.filter(el=>{
            return el.id == this.typeCreateId
          })[0].code
        }
      },

      ignoreMdmValidation: function(){
        return this.typeCreateCode === "code"
      },

      disabledButtonSave: function(){
        var res = true
        if (this.typeCreateId!==null){
          if(this.typeCreateCode==='guid'){
            res = false
          }else{
            if (this.valueData===null || this.valueData === ""){
              res = true
            }else{
              res = false
            }
          }
        }
        return res
      }

    },
    mounted: function(){
      this.getContentBackgroundList().then(res => {
        this.contentBackgroundList = res
      })
    }
  }

</script>

