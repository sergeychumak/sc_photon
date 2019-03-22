<template>
  <v-layout style="border-top: 1px solid #e0e0e0">

    <!-- NAME -->
    <div ref="isHook__Name" class="blue--text">
      / Редактирование карточки № {{$route.params.id}}
    </div>

    <!-- ACTION -->
    <div ref="isHook__Actions">

      <v-btn icon @click="showUploadBlock=true"><v-icon>cloud_download</v-icon></v-btn>

      <v-menu transition="slide-x-transition" left v-if="sync_listChecked.length > 0">
        <v-btn slot="activator" dark color="blue">
          <v-icon>check_box</v-icon>
          <span class="body-2 pl-2">{{sync_listChecked.length}}</span>
        </v-btn>
        <v-list dense>
          <v-list-tile v-for="item in photoStatusWorkflowList" :key="item.nextPhotoStatusCode"
                       @click="setPhotoNewStatus(item.nextPhotoStatusCode)">
            <v-icon color="blue" class="pr-2">label</v-icon>
            <v-list-tile-title class="blue--text">{{$t('STATUS.BLOCK.' + item.nextPhotoStatusName )}}</v-list-tile-title>
          </v-list-tile>
          <template v-if="showDeleteBlock">
            <v-divider></v-divider>
            <v-list-tile @click="dialog.deletePhoto = true" >
              <v-icon color="red" class="pr-2">delete_forever</v-icon>
              <v-list-tile-title class="red--text">Удалить</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list>
      </v-menu>
      <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
    </div>

    <v-progress-linear
      v-if="loading"
      :indeterminate="true"
      height="2"
      color="blue"
      class="pa-0 ma-0"
      style="position: absolute; top: 0px; left: 0; right: 0;"
    ></v-progress-linear>

     <v-flex shrink>
       <v-navigation-drawer permanent class="pa-2 elevation-5">
         <wareCardDetail></wareCardDetail>
       </v-navigation-drawer>
     </v-flex>

     <v-flex class="overflowAuto pa-2">

        <UploadFiles
          v-if="showUploadBlock"
          postURL = "api/photoFile/photoFileByWareCard"
          :showUploadBlock.sync="showUploadBlock"
          v-on:uploadComplete="uploadComplete"
          :wareCardCode="infoData.wareCardCode"
        ></UploadFiles>


       <v-card class="mb-2 " v-if="perspective.chosen !== 0 || perspective.view !== 0">
         <v-card-title primary-title class="pt-2 pb-2 pr-4 pl-4">
           <template v-if="perspective.chosen!==perspective.view">
             <v-icon color="red" class="pr-3">warning</v-icon>
             Проставленно ракурсов {{perspective.chosen}} из {{perspective.view}}.
           </template>
           <template v-else>
             <v-icon color="green" class="pr-3">check</v-icon>
             Все ракурсы проставлены
           </template>
           <v-spacer></v-spacer>
           <v-btn small flat color="blue" @click="$router.push({name:'perspective', params: {id:infoData.wareCardCode}})">Проставить ракурсы</v-btn>
         </v-card-title>
       </v-card>



       <v-expansion-panel
         v-model="panel"
       >
         <v-expansion-panel-content v-for="(item,i) in cards" :key="i">
           <div slot="header" >

             <v-layout align-center >
               <v-flex class="title blue--text pa-2">{{$t('STATUS.BLOCK.' + item.photoStatusName )}}</v-flex>
               <v-flex shrink class="caption grey--text pr-3">
                 <template v-if="panel==i">
                   <template v-if="item.photoList.length !== sync_listChecked.length">
                     <a href="" @click.prevent.stop="selectAllImagesInGroup">Выбрать все</a> /
                   </template>
                   <template v-else>
                     <a href="" @click.prevent.stop="sync_listChecked = []">Отменить выделение</a> /
                   </template>

                 </template>
                 {{$t('TOTAL_PHOTOS')}}: {{item.photoList.length}} шт.
               </v-flex>
             </v-layout>

             <!--<span class="title blue&#45;&#45;text">{{$t('STATUS.BLOCK.' + item.photoStatusName )}}</span>-->
             <!--<template v-if="panel==i">-->
               <!--<v-btn small flat class="ml-4">Выбрать все</v-btn>-->
             <!--</template>-->
             <!--<br/>-->
             <!--<span class="caption grey&#45;&#45;text">{{$t('TOTAL_PHOTOS')}}: {{item.photoList.length}} шт.</span>-->

           </div>




           <WrapCard
             :list="item.photoList"
             :sync_listChecked.sync="sync_listChecked"
             :sync_nameBlock.sync="sync_nameBlock"
           ></WrapCard>


         </v-expansion-panel-content>
       </v-expansion-panel>

     </v-flex>

    <v-dialog v-model="dialog.yesno" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Смена статуса?</v-card-title>
        <v-card-text>Вы уверены что хотите сменить статус карточки?</v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="changeWareCardStatus(false)">Нет</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="changeWareCardStatus(true)">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.deletePhoto" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Удаление фотографий?</v-card-title>
        <v-card-text>Вы уверены что хотите удалить выбранные фотографиииз карточки?</v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="dialog.deletePhoto = false">Нет</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="deletePhoto">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
  import {mapActions} from 'vuex'
  import {convertDate} from "@/utils/mixins/date"
  // import ChangeColorModelComponent from "@/components/v1/change-colorModel"

  import WrapCardComponent from "@/components/build-1/card/wrapCard"
  import UploadFilesComponent from "@/components/build-1/upload-files"

  import wareCardDetailComponent from "@/components/wareCardDetail"

  export default {
    name: 'card-edit',
    mixins: [convertDate],
    components:{
      // ChangeColorModelComponent: ChangeColorModelComponent,
      WrapCard: WrapCardComponent,
      UploadFiles: UploadFilesComponent,
      wareCardDetail: wareCardDetailComponent
    },
    data: function(){
      return {
        loading: false,
        panel:null,

        key: null,
        infoHeaders: [],
        infoData: {},
        cards: [],

        sync_listChecked: [],
        sync_nameBlock: "",

        form:{
          wareCardStatus: null
        },

        dialog: {
          yesno: false,
          deletePhoto: false
        },

        perspective: {
          view: 0,
          chosen: 0
        },

        showUploadBlock: false

      }
    },
    watch: {
      "form.wareCardStatus": function(newValue,oldValue){
        if (newValue!==null)
          this.$set(this.dialog,'yesno',true)
      },
      "panel": function(newValue){
        this.$router.push({
          query: {
            panel: newValue
          }
        })
        this.sync_listChecked = []
      }
    },
    mounted: function(){
      //this.getDetail()
      this.getBlocks()
      if (this.$route.query['panel']){
        this.panel = parseInt(this.$route.query['panel'])
      }
    },
    methods: {

      ...mapActions("photoController", {
        getPhotoBlockList: "getPhotoBlockList"
      }),

      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest",
        DELETE_REQUEST: "deleteRequest",
        ERROR_HANDLER: "errorHandler"
      }),


      getBlocks: function(){
        this.loading = true
        this.GET_REQUEST({
          url: "wareCard.blocks",
          appData: "/" + this.$route.params.id
        })
        .then(res =>{
          this.cards = res.data
          setTimeout(()=>this.loading = false,1000)
        })
      },

      changeWareCardStatus: function(f){
        // if (f){
        //   this.POST_REQUEST({
        //     url: "wareCard.setStatus",
        //     data: {
        //       wareCardCode: this.infoData.wareCardCode,
        //       wareCardStatusCode: this.form.wareCardStatus
        //     }
        //   })
        //   .then(()=>{
        //     this.dialog.yesno = false
        //     this.getDetail()
        //   })
        // }else{
        //   this.dialog.yesno = false
        //   this.form.wareCardStatus = null
        // }
      },

      getUrlImage: function (id) {
        return "api/photoFile/photoFile/" + id
      },

      uploadComplete: function(){
        this.getBlocks()
      },

      // selectedImage: function(id, statusName){
      //   if (this.nameBlockCheckedPhoto !== statusName) {
      //     this.listCheckedPhoto = []
      //   }
      //   this.listCheckedPhoto.push(id)
      //   this.nameBlockCheckedPhoto = statusName
      // },

      // unselectedImage: function (id) {
      //   this.listCheckedPhoto = this.listCheckedPhoto.filter((el) => {
      //     if (el !== id)
      //       return true
      //   })
      // },

      // in_listCheckedPhoto: function (id) {
      //   var res = this.listCheckedPhoto.filter((el) => {
      //     if (el === id) {
      //       return true;
      //     }
      //   })
      //   return !(res.length > 0)
      // },

      showDeleteBlock: function (){
        var index = this.infoData.wareCardPermissions.indexOf("delete_photo");
        if (index !== -1) {
          return true
        }
        return false
      },

      deletePhoto: function () {
        this.DELETE_REQUEST({
          url: "image.delete",
          data: {
            photoCodeList : this.sync_listChecked
          }

        })
        .then(() => {
          this.getBlocks()
          this.sync_listChecked = []
          this.dialog.deletePhoto = false
        })

      },

      setPhotoNewStatus: function(id){
        this.POST_REQUEST({
          url: "image.setNewStatus",
          data: {
            photoStatusCode: id,
            photoCodeList: this.sync_listChecked
          }
        })
        .then(() => {
          this.getBlocks()
          this.sync_listChecked = []
          this.nameBlockCheckedPhoto = ""
        })
      },

      back: function(){
        // if (window.history.state === null){
          this.$router.push({name:"card-list"})
        // }else{
        //   this.$router.go(-1)
        // }
      },

      selectAllImagesInGroup: function(){

        console.log(this.cards)

        var res = []
        this.cards[this.panel].photoList.map(el=>{
          res.push(el.photoCode)
        })
        this.sync_nameBlock = this.cards[this.panel].photoStatusName
        this.sync_listChecked = res
      }

    },
    computed:{
      photoStatusWorkflowList: function () {
        return this.cards.filter((el) => {
           if (el.photoStatusName === this.sync_nameBlock)
             return true
         })[0].photoStatusWorkflowList
      },
      showEditColormodel: function (){
        var index = this.infoData.wareCardPermissions.indexOf("update_ware_color_model");
        if (index !== -1) {
          return true
        }
        return false
      }
    }
  }

</script>
