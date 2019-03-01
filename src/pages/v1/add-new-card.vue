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

        <h3 class="mb-2">Тип создания</h3>
          <v-select
            v-model="form.type"
            :items="list.type"
            solo
            item-text="label"
            item-value="id"
            hide-details
          ></v-select>

        <h3 class="mb-2 mt-3">Сайт</h3>
          <v-select
            v-model="form.gateSitesGroupCode"
            :items="list.gateSitesGroupCode"
            solo
            item-text="name"
            item-value="name"
            hide-details
          ></v-select>

        <div v-if="form.type!=='guid'">
          <h3 class="mb-2 mt-3" >Значение</h3>
            <v-text-field solo v-model="form.value" hide-details></v-text-field>
        </div>

      </div>


    </v-flex>

  </v-layout>

</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'add-new-card',
    data: function(){
      return {
        form: {
          type: null,
          gateSitesGroupCode: null,
          value: null
        },
        list: {
          type: [
            {id:"article",label:"По артиклу "},
            {id:"code",label:"По шрих коду "},
            {id:"colormodel",label:"По цветомодели "},
            {id:"guid",label:"По guid "}
          ],
          gateSitesGroupCode: []
        }
      }
    },
    mounted: function(){
      this.GET_REQUEST({url:"gateSitesGroup.list"}).then((res) => {
        this.$set(this.list, 'gateSitesGroupCode', res.data)
      })
    },
    methods:{
      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest"
      }),
      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      },
      save: function(){
        this.POST_REQUEST({
          url: 'wareCard.create.by-' + this.form.type,
          data: {
            "userName": "",
            "value": this.form.value,
            "gateSitesGroupName": this.form.gateSitesGroupCode,
            "ignoreMdmValidation": this.ignoreMdmValidation
          }
        })
        .then(()=>{this.back()})
      }
    },
    computed: {
      ignoreMdmValidation: function(){
        return this.form.type === "code"
      },
      disabledButtonSave: function(){
        var res = true
        if (this.form.type!==null && this.form.gateSitesGroupCode!==null){
          if(this.form.type==='guid'){
            res = false
          }else{
            if (this.form.value===null || this.form.value === ""){
              res = true
            }else{
              res = false
            }
          }
        }
        return res
      }
    }
  }

</script>

