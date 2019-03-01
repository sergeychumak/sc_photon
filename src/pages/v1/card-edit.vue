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

         <v-card v-for="itemHeader in infoHeaders" class="mb-2">
           <div class="blue lighten-5 pa-1 pl-2 caption font-weight-bold">{{$t('TABLE_KEY.' + key + "." + itemHeader)}}</div>
           <div class="pa-2 caption">


             <template v-if="itemHeader==='wareCardCreateDate'">
               {{convertTimeToDate(infoData[itemHeader])}}
             </template>

             <template v-else-if="itemHeader==='wareCardStatusName'">
               <v-select
                 solo
                 v-model="form.wareCardStatus"
                 :label="$t('STATUS.KT.' + infoData['wareCardStatusName'] )"
                 :items="infoData['wareCardStatusWorkflowDtoList']"
                 item-text="nextWareCardStatusName"
                 item-value="nextWareCardStatusCode"
                 hide-details
                 class="caption"
               >
                 <template slot="selection" slot-scope="data">
                   <div class="caption">{{$t('STATUS.KT.' + data.item.nextWareCardStatusName )}}</div>
                 </template>
                 <template slot="item" slot-scope="data">
                   <div class="caption">{{$t('STATUS.KT.' + data.item.nextWareCardStatusName )}}</div>
                 </template>
               </v-select>
             </template>

             <template v-else-if="itemHeader==='barcodeList' || itemHeader==='articleNumberList' || itemHeader==='guidList'">
               <template v-if="infoData[itemHeader].length > 0">
                 <div v-for="item in infoData[itemHeader]">{{item}}</div>
               </template>
               <template v-else>
                 <span class="red--text font-weight-bold">Нет данных</span>
               </template>
             </template>

             <template v-else-if="itemHeader==='wareColorModel'">
               <ChangeColorModelComponent
                 v-on:success-save="this.getDetail()"
                 :wareCardCode="infoData['wareCardCode']"
                 :colorModel="infoData[itemHeader]"
                 :showEditColormodel="showEditColormodel"
               ></ChangeColorModelComponent>
             </template>

             <template v-else>
               {{infoData[itemHeader]}}
             </template>

           </div>
         </v-card>

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




           <!--<v-card class="pb-3">-->
             <!--<v-layout row wrap>-->
               <!--<v-flex-->
                 <!--v-for="(image, index) in item.photoList"-->
                 <!--:key="index" xs3 d2-flex class="elevation-0"-->
                 <!--style="position: relative"-->
               <!--&gt;-->

                 <!--<div class="ma-2 pa-2 "-->
                    <!--style="border:1px #2196f3;"-->
                    <!--:style="{-->
                      <!--'background': in_listCheckedPhoto(image.photoCode) ? '#fff' : '#ebf8ff',-->
                      <!--'border-style': in_listCheckedPhoto(image.photoCode) ? 'dashed' : 'solid'-->
                    <!--}"-->
                 <!--&gt;-->
                   <!--<v-layout>-->
                     <!--<v-flex class="caption">{{image.originalFileName}}</v-flex>-->
                     <!--<v-flex class="caption text-xs-right">{{image.photographerUserName}}</v-flex>-->
                   <!--</v-layout>-->
                   <!--<v-layout>-->
                     <!--<v-flex class="caption">{{convertTimeToDate(image.photoFileCreateDate)}}</v-flex>-->
                     <!--<v-flex class="caption text-xs-right">{{image.shootingFormatName}}</v-flex>-->
                   <!--</v-layout>-->
                   <!--<v-layout class="mt-3 mb-2">-->
                     <!--<v-flex>-->
                       <!--<div-->
                         <!--:style="{-->
                            <!--width:'100%',-->
                            <!--height:'150px',-->
                            <!--backgroundSize: '95%',-->
                            <!--backgroundPosition: 'center center',-->
                            <!--backgroundImage: 'url(' + getUrlImage(image.photoFileCodePreview) + ')',-->
                            <!--border: '1px dashed #ddd'-->
                          <!--}"-->
                       <!--&gt;</div>-->
                     <!--</v-flex>-->
                   <!--</v-layout>-->

                   <!--<v-layout>-->

                     <!--<v-flex>-->
                       <!--<template v-if="in_listCheckedPhoto(image.photoCode)">-->
                         <!--<v-btn-->
                           <!--class="pa-0 ma-0"-->
                           <!--@click="selectedImage(image.photoCode, item.photoStatusName)"-->
                           <!--small icon>-->
                           <!--<v-icon>check_box_outline_blank</v-icon>-->
                         <!--</v-btn>-->
                       <!--</template>-->
                       <!--<template v-else>-->
                         <!--<v-btn-->
                           <!--class="pa-0 ma-0"-->
                           <!--@click="unselectedImage(image.photoCode)"-->
                           <!--small icon>-->
                           <!--<v-icon color="blue">check_box</v-icon>-->
                         <!--</v-btn>-->
                       <!--</template>-->
                     <!--</v-flex>-->

                     <!--<v-flex shrink>-->

                       <!--<v-tooltip bottom>-->
                         <!--<v-btn-->
                           <!--@click="$router.push({name: 'image-history' , params: {id: image.photoCode}})"-->
                           <!--class="pa-0 ma-0"-->
                           <!--color="teal"-->
                           <!--slot="activator"-->
                           <!--small flat icon-->
                         <!--&gt;<v-icon color="teal" class="pa-0 ma-0">image</v-icon></v-btn>-->
                         <!--<span>История</span>-->
                       <!--</v-tooltip>-->

                       <!--<v-tooltip bottom>-->
                         <!--<v-btn-->
                           <!--@click="$router.push({name: 'image-show' , params: {id: image.photoFileCodeMain}})"-->
                           <!--class="pa-0 ma-0"-->
                           <!--color="blue"-->
                           <!--slot="activator"-->
                           <!--small flat icon-->
                         <!--&gt;<v-icon color="blue" class="pa-0 ma-0">crop_original</v-icon></v-btn>-->
                         <!--<span>Оригинал</span>-->
                       <!--</v-tooltip>-->

                     <!--</v-flex>-->

                   <!--</v-layout>-->

                 <!--</div>-->

               <!--</v-flex>-->
             <!--</v-layout>-->
           <!--</v-card>-->
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
  import ChangeColorModelComponent from "@/components/v1/change-colorModel"

  import WrapCardComponent from "@/components/build-1/card/wrapCard"
  import UploadFilesComponent from "@/components/build-1/upload-files"

  export default {
    name: 'card-edit',
    mixins: [convertDate],
    components:{
      ChangeColorModelComponent: ChangeColorModelComponent,
      WrapCard: WrapCardComponent,
      UploadFiles: UploadFilesComponent
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
      this.getDetail()
      if (this.$route.query['panel']){
        this.panel = parseInt(this.$route.query['panel'])
      }
    },
    methods: {
      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest",
        DELETE_REQUEST: "deleteRequest",
        ERROR_HANDLER: "errorHandler"
      }),

      getDetail: function(){
        this.GET_REQUEST({
          url: "wareCard.detail",
          appData: "/" + this.$route.params.id
        })
          .then(res=>{
            this.key = res.key
            this.infoHeaders = res.headers
            this.infoData = res.data

            this.getBlocks()

            //Смотрим каккие ракурсы есть и сколько фоток привязанно
              this.GET_REQUEST({url: "perspective.view", appData: "/" + res.data.wareCardCode})
                .then(res=>{ this.perspective.view = res.data.length })
              this.GET_REQUEST({url: "perspective.chosen", appData: "/" + res.data.wareCardCode})
                .then(res=>{ this.perspective.chosen = res.data.length })
            
          })
      },

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
        if (f){
          this.POST_REQUEST({
            url: "wareCard.setStatus",
            data: {
              wareCardCode: this.infoData.wareCardCode,
              wareCardStatusCode: this.form.wareCardStatus
            }
          })
          .then(()=>{
            this.dialog.yesno = false
            this.getDetail()
          })
        }else{
          this.dialog.yesno = false
          this.form.wareCardStatus = null
        }
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

<style>

</style>
