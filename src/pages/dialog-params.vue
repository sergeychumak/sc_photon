<template>


  <div style="width: 100%; height:100%; padding: 40px; background: #fff; overflow: auto">
    <div style="width:100%; margin:0 auto">

      <v-toolbar color="darken-3" app fixed1 dense>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Параметры</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="addBlock" flat small color="primary">Добавить пару</v-btn>
        <v-btn @click="saveBlock" flat small color="green">Сохранить</v-btn>
      </v-toolbar>

        <v-content v-if="listBlock.length > 0">

          <h1>Группа сайтов + брендбук</h1>

          <v-layout class="mt-3">
            <v-flex xs5>Сайт</v-flex>
            <v-flex xs5>Карта</v-flex>
            <v-flex xs2></v-flex>
          </v-layout>
          <template v-for="(item,index) in listBlock">

            <v-layout class="mb-3">
              <v-flex xs5 class="pr-2">
                <v-select
                  v-model="form.gate[index]"
                  :items="GATE_SITES_GROUP_LIST_FILTER"
                  solo
                  item-text="name"
                  item-value="gateSitesGroupForeignCode"
                  :label="getLabel(index)"
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex xs5>
                <v-select
                  v-model="form.back[index]"
                  :items="CONTENT_BACKGROUND_LIST"
                  solo
                  item-text="name"
                  item-value="contentBackgroundForeignCode"
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex xs2>
                <v-btn @click="deleteBlock(index)">Удалить</v-btn>
              </v-flex>
            </v-layout>

          </template>

          <v-layout class="mt-4">
            <v-flex xs6><h1>Группа сайтов пользовательская</h1></v-flex>
            <v-flex xs6></v-flex>
          </v-layout>
          <v-layout class="mt-4">
            <v-flex xs6>
              <v-select
                v-model="currentWebSite"
                :items="website_list"
                label="Выберете сайт"
                solo
                item-text="name"
                hide-details
                return-object
              ></v-select>
              <div class="red--text">{{error}}</div>
            </v-flex>
            <v-flex xs2>
              <v-btn color="primary" @click="addWebSite">Добавить</v-btn>
            </v-flex>
            <v-flex xs4></v-flex>
          </v-layout>

          <v-layout class="mt-4" v-for="(item,key) in objSelectedWebSite" :key="key">
            <v-flex xs6>
              <v-card color="blue lighten-5">
                <v-card-title primary-title class="pb-0" color="blue">
                  <div>
                    <h3 class="headline mb-0">Сайт: {{item.name}}</h3>
                  </div>
                </v-card-title>
                <v-card-text class="pt-0 pb-0">
                  <v-combobox
                    v-model="objSelectedWebSite[key].data"
                    :items="listUserSitesGroup"
                    item-text="name"
                    item-value="userSitesGroupForeignCode"
                    multiple
                    chips
                  ></v-combobox>
                </v-card-text>
                <v-card-actions>
                  <v-btn icon color="error" @click="deleteWebSite(key)"><v-icon>delete</v-icon></v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs6></v-flex>
          </v-layout>

        </v-content>






    </div>

  </div>
</template>

<script>
  export default {
    name: 'DialogCardAddNew',
    props: ["dialog_params"],
    data: () => ({
      form: {
        gate:[],
        back:[]
      },
      GATE_SITES_GROUP_LIST: [],
      GATE_SITES_GROUP_LIST_FILTER: [],
      CONTENT_BACKGROUND_LIST: [],

      listBlock: [],
      listUserSitesGroup: [],
      selected: [
        { "name": "oneill", "userSitesGroupForeignCode": 10370000 },
        { "name": "sm RU", "userSitesGroupForeignCode": 10290000 }
        ]
      ,
      // Группа сайтов пользовательская
      currentWebSite: null,
      objSelectedWebSite: {},
      website_list: [],
      error: ""
    }),
    watch: {
      "form.gate": function(newValue){
        this.GATE_SITES_GROUP_LIST_FILTER = this.GATE_SITES_GROUP_LIST.filter((el)=>{
          return newValue.indexOf(el.gateSitesGroupForeignCode) === -1
        })
      },
      dialog_params: function(newValue){
        if (newValue){
          this.$store.dispatch( "GATE_SITES_GROUP_LIST" )
            .then( (res) => {



              this.GATE_SITES_GROUP_LIST = res.data
              this.GATE_SITES_GROUP_LIST_FILTER = res.data

              this.$store.dispatch("GET_WEBSITE_LIST").then(res=>{
                this.website_list = res.data

                let a = []
                let b = []
                res.data.map(el=>{
                  this.listBlock.push({
                    idGateSites: 0,
                    idContentBackground: 0
                  })
                  a.push(el.gateSitesGroupForeignCode)
                  b.push(el.contentBackgroundForeignCode)
                })
                this.form = Object.assign({}, {
                  gate:a,
                  back:b
                })
              })
            })
          this.$store.dispatch( "CONTENT_BACKGROUND_LIST" )
            .then( (res) => {
              this.CONTENT_BACKGROUND_LIST = res.data
            })

          this.$store.dispatch( "GET_USER_SITES_GROUP_LIST" ).then(res=>{
            this.listUserSitesGroup = res.data
          })

          this.$store.dispatch( "GET_USER_SITES_GROUP_LIST_REF" ).then(res=>{

            let result = {}

            res.data.map(el=>{
              result[el.gateSitesGroupCode] = {}
              var name = ""
              var data = []
              el.refUserSitesGroupList.map( element => {
                name = element.gateSitesGroupName
                data.push({
                  "name": element.userSitesGroupName,
                  "userSitesGroupForeignCode": element.userSitesGroupForeignCode
                })
              })
              result[el.gateSitesGroupCode] = {
                "name": name,
                "data": data
              }
            })
            this.objSelectedWebSite = result
          })

        }
      }
    },
    mounted: function(){

    },
    methods: {
      addBlock: function(){
        this.listBlock.push({
          idGateSites: 0,
          idContentBackground: 0
        })
      },
      saveBlock: function(){
        //console.log( this.form)
        let refWebSiteRecordRequestList = []

        this.form.gate.map((el,index) => {
          refWebSiteRecordRequestList.push(
            {
              "contentBackgroundForeignCode": this.form.back[index],
              "gateSitesGroupForeignCode": el,
              "gateSitesGroupName": this.getLabel(index)
            }
          )
        })
        this.$store.dispatch("UPDATE_WEBSITE_LIST",{'refGateSitesGroupRecordRequestList': refWebSiteRecordRequestList})
          .then(res => {
            //console.log( res )
          })


        let data2Save = []

        Object.keys(this.objSelectedWebSite).map(el => {

          // console.log(this.objSelectedWebSite[el])
          
          let refUserSitesGroupRecordRequestList = []
          this.objSelectedWebSite[el].data.map(element => {
            refUserSitesGroupRecordRequestList.push({
              "name": element.name,
              "userSitesGroupForeignCode": element.userSitesGroupForeignCode
            })
          })

          data2Save.push({
            "gateSitesGroupCode": parseInt(el),
            "refUserSitesGroupRecordRequestList": refUserSitesGroupRecordRequestList
          })



        }) // Object.keys(this.objSelectedWebSite).map(el => {

        this.$store.dispatch("UPDATE_USER_SITES_GROUP_LIST",
          {"refUserSitesGroupRecordRequestList": data2Save})
          .then(() => {
            console.log(909)
          })

      },
      getLabel : function(index){
        let label = ""
        this.GATE_SITES_GROUP_LIST.map((el)=>{
          if (el.gateSitesGroupForeignCode === this.form.gate[index]){
            label = el.name
          }
        })
        return label
      },
      deleteBlock: function(index){
        this.listBlock = this.listBlock.filter((el,indexEl)=>{
          return indexEl !== index
        })
        let a = this.form.gate.filter((el,indexEl)=>{
            return indexEl !== index
          })
        let b = this.form.back.filter((el,indexEl)=>{
          return indexEl !== index
        })
        this.form = Object.assign({}, {
          gate:a,
          back:b
        })

      },


      // Группа сайтов пользовательская
      addWebSite: function(){
        console.log(this.currentWebSite)
        if (this.currentWebSite !== null){
          if (!this.objSelectedWebSite[this.currentWebSite.gateSitesGroupCode]){
            this.$set(this.objSelectedWebSite, this.currentWebSite.gateSitesGroupCode, {
              name: this.currentWebSite.name,
              data: []
            })
          }else{

            this.error = "Настройка уже существует."
            setTimeout(function(){
              this.error = ""
            }.bind(this),3000)
          }
        }else{
          console.log('currentWebSite not select')
        }

      },
      deleteWebSite: function(id){
        let res = {}
        Object.keys(this.objSelectedWebSite).map( el =>{
          console.log(el, id)
           if (el !== id) {
             res[el] = this.objSelectedWebSite[el]
           }
        })
        this.objSelectedWebSite = res
      }

    },
    computed: {}
  }


</script>


