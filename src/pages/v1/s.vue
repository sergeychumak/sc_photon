<template>
  <v-layout column style="border-top: 1px solid #e0e0e0">

    <v-flex class="overflowAuto" style="background: #fff"  >

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / Настройки системы
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">
        <v-btn color="primary" small @click="saveBlock">Сохранить настройки</v-btn>
        <v-btn color="blue" dark small @click="addBlock">Добавить пару</v-btn>
        <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
      </div>

      <v-layout class="pa-3">
        <v-flex xs2>Сайт</v-flex>
        <v-flex xs2>Фотобук</v-flex>
        <v-flex xs7>Группа сайтов</v-flex>
        <v-flex xs1></v-flex>
      </v-layout>

      <v-layout class="pa-3" v-for="(item, index) in data">
        <v-flex xs2>

          <v-select
            v-model="form.site[index]"
            :items="list.site"
            solo
            item-text="name"
            item-value="gateSitesGroupForeignCode"
            hide-details
          ></v-select>

          <!--name: {{item.name}} <br/>-->
          <!--contentBackgroundForeignCode: {{item.contentBackgroundForeignCode}} <br/>-->
          <!--gateSitesGroupForeignCode: {{item.gateSitesGroupForeignCode}} <br/>-->
          <!--gateSitesGroupCode: {{item.gateSitesGroupCode}} <br/>-->
        </v-flex>
        <v-flex xs2>
          <v-select
            v-model="form.background[index]"
            :items="list.background"
            solo
            item-text="name"
            item-value="contentBackgroundForeignCode"
            hide-details
          ></v-select>
        </v-flex>
        <v-flex xs7>
          <v-combobox
            solo
            v-model="form.userSitesGroup[index]"
            :items="list.userSitesGroup"
            item-text="name"
            item-value="userSitesGroupForeignCode"
            multiple
            chips
          ></v-combobox>
        </v-flex>
        <v-flex xs1>
          <v-btn color="error" icon flat small @click="deleteBlock(index)"><v-icon>delete</v-icon></v-btn>
        </v-flex>
      </v-layout>

    </v-flex>

  </v-layout>

</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'settings',
    data: function(){
      return {
        form: {
          site: [],
          background: [],
          userSitesGroup: []
        },
        list: {
          site: [],
          background: [],
          userSitesGroup: [],
          userSitesGroup_form: [],
        },

        data: []

      }
    },
    mounted: function(){

      Promise.all([
        this.GET_REQUEST({url: "site.userSitesGroup"}).then(res=>{this.list.userSitesGroup_form = res.data}),
        this.GET_REQUEST({url: "site.group"}).then(res=>{this.list.site = res.data}),
        this.GET_REQUEST({url: "background.list"}).then(res=>{this.list.background = res.data}),
        this.GET_REQUEST({url: "site.getUserSitesGroup"}).then(res=>{this.list.userSitesGroup = res.data}),
        this.GET_REQUEST({url: "site.list"}).then(res=> {this.data = res.data})
      ]).then(()=>{
        this.data.map(el=>{

          this.form.site.push(el.gateSitesGroupForeignCode)
          this.form.background.push(el.contentBackgroundForeignCode)

          var a = this.list.userSitesGroup_form.filter(el1=>{
            if (el1.gateSitesGroupCode === el.gateSitesGroupCode )
              return true
            return false
          })

          if (a.length > 0){
            var b = []
            a[0].refUserSitesGroupList.map(elRef => {
              b.push({
                "name": elRef.userSitesGroupName,
                "userSitesGroupForeignCode": elRef.userSitesGroupForeignCode
              })
            })
            this.form.userSitesGroup.push(b)

          }else{
            this.form.userSitesGroup.push([])
          }
        })

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
      deleteBlock: function(index){
        this.data = this.data.filter((el,indexEl)=>{return indexEl !== index})
        this.form.site = this.form.site.filter((el,indexEl)=>{return indexEl !== index})
        this.form.background = this.form.background.filter((el,indexEl)=>{return indexEl !== index})
        this.form.userSitesGroup = this.form.userSitesGroup.filter((el,indexEl)=>{return indexEl !== index})
      },
      addBlock: function(){
        this.data.push({})
      },
      saveBlock: function(){

        var refGateSitesGroupRecordRequestList = []
        this.form.site.map((el,index)=>{
          refGateSitesGroupRecordRequestList.push({
            contentBackgroundForeignCode: this.form.background[index],
            gateSitesGroupForeignCode: el,
            gateSitesGroupName: this.data[index].name
          })
        })
        this.POST_REQUEST({url: "site.updateWebSiteList", data: {refGateSitesGroupRecordRequestList: refGateSitesGroupRecordRequestList}})


        refGateSitesGroupRecordRequestList = []
        this.form.site.map((el,index)=>{
          refGateSitesGroupRecordRequestList.push({
            "gateSitesGroupCode": this.data[index].gateSitesGroupCode,
            "refUserSitesGroupRecordRequestList": this.form.userSitesGroup[index]
          })
        })
        this.POST_REQUEST({url: "site.updateUserSitesGroupList", data: {refUserSitesGroupRecordRequestList: refGateSitesGroupRecordRequestList}})
      },

    },
    computed: {}
  }

</script>

