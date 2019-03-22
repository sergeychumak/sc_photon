<template>

  <div class="vApplication">

    <div class="vApplication__page">

      <v-toolbar dense>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Редактирование карточки #{{idCard}}</v-toolbar-title>
        <v-progress-circular v-if="loading" indeterminate color="blue" :width="2" :size="20"
                             class="ml-3"></v-progress-circular>
        <v-spacer></v-spacer>

        <v-btn flat small color="primary" @click="dialog_perspective=true">Ракурсы</v-btn>

        <v-toolbar-items>
          <v-menu transition="slide-x-transition" left v-if="listCheckedPhoto.length > 0">
            <v-btn slot="activator" dark color="blue">
              <v-icon>check_box</v-icon>
              <span class="body-2 pl-2">{{listCheckedPhoto.length}}</span>
            </v-btn>
            <v-list dense>
              <v-list-tile v-for="item in photoStatusWorkflowList" :key="item.nextPhotoStatusCode"
                           @click="setPhotoNewStatus(item.nextPhotoStatusCode)">
                <v-icon color="blue" class="pr-2">label</v-icon>
                <v-list-tile-title class="blue--text">{{$t('STATUS.BLOCK.' + item.nextPhotoStatusName )}}</v-list-tile-title>
              </v-list-tile>

              <template v-if="showDeleteBlock">
                <v-divider></v-divider>
                <v-list-tile @click="dialog__deletePhoto = true" >
                  <v-icon color="red" class="pr-2">delete_forever</v-icon>
                  <v-list-tile-title class="red--text">Удалить</v-list-tile-title>
                </v-list-tile>
              </template>



            </v-list>
          </v-menu>

        </v-toolbar-items>
      </v-toolbar>
      <div class="app" style=" background: #fff">

        <div class="app__page">

          <div class="app__content">
            <div class="app__content_left pa-2">

              <template v-for="itemHeader in infoHeaders">

                <v-card class="mb-3">
                  <div class="blue lighten-4 pa-2 body-2">{{$t('TABLE_KEY.' + key + "." + itemHeader)}}</div>
                  <div class="pa-2">

                    <template v-if="itemHeader==='wareCardCreateDate'">
                      {{convertTimeToDate(infoData[itemHeader])}}
                    </template>

                    <template v-else-if="itemHeader==='wareColorModel'">

                      <!--<ChangeColorModelComponent-->
                        <!--v-on:success-save="successSaveColormodel"-->
                        <!--:wareCardCode="infoData['wareCardCode']"-->
                        <!--:colorModel="infoData[itemHeader]"-->
                        <!--:showEditColormodel="showEditColormodel"-->
                      <!--&gt;</ChangeColorModelComponent>-->

                      <!--<template v-if="infoData[itemHeader] === null">-->
                        <!--<span class="body-2 red&#45;&#45;text">ЦМ отсутствует</span>-->
                      <!--</template>-->
                      <!--<template v-else>-->
                        <!--{{infoData[itemHeader]}}-->
                        <!--<div v-if="showEditColormodel">-->
                          <!--<a href="">Изменить</a>-->
                        <!--</div>-->
                        <!--&lt;!&ndash;<v-icon small>edit</v-icon>&ndash;&gt;-->

                        <!---->

                      <!--</template>-->
                    </template>

                    <template v-else-if="
                      itemHeader==='barcodeList' ||
                      itemHeader==='articleNumberList' ||
                      itemHeader==='guidList'
                      ">
                      <template v-if="infoData[itemHeader].length > 0">
                        <div v-for="item in infoData[itemHeader]">{{item}}</div>
                      </template>
                      <template v-else>
                         Нет данных
                      </template>
                    </template>

                    <template v-else-if="itemHeader==='wareCardStatusName'">
                      <v-select
                        solo
                        v-model="wareCardStatus"
                        :label="$t('STATUS.KT.' + infoData['wareCardStatusName'] )"
                        :items="infoData['wareCardStatusWorkflowDtoList']"
                        item-text="nextWareCardStatusName"
                        item-value="nextWareCardStatusCode"
                        hide-details
                      >
                        <template slot="label" slot-scope="data">
                          <div>{{$t('STATUS.KT.' + data.item.nextWareCardStatusName )}}</div>
                        </template>
                        <template slot="selection" slot-scope="data">
                          <div>{{$t('STATUS.KT.' + data.item.nextWareCardStatusName )}}</div>
                        </template>
                        <template slot="item" slot-scope="data">
                          <div>{{$t('STATUS.KT.' + data.item.nextWareCardStatusName )}}</div>
                        </template>
                      </v-select>
                    </template>

                    <template v-else>
                      {{infoData[itemHeader]}}
                    </template>

                  </div>
                </v-card>
              </template>

            </div>
            <div class="app__content_center pa-2">

              <v-expansion-panel focusable>
                <v-expansion-panel-content v-for="(item,i) in cards" :key="i">
                  <div slot="header">
                    <span class="title blue--text">{{$t('STATUS.BLOCK.' + item.photoStatusName )}}</span><br/>
                    <span class="caption grey--text">{{$t('TOTAL_PHOTOS')}}: {{item.photoList.length}} шт.</span>
                  </div>
                  <v-card>
                    <v-container grid-list-sm fluid class="pt-2 pl-2 pr-2">
                      <v-layout row wrap>



                         <v-flex
                           v-for="(image, index) in item.photoList"
                           :key="index" xs3 d2-flex class="elevation-0"
                           style="position: relative"
                         >


                             <v-layout
                               v-if="image.isFileExists === false"
                               style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; background: #fff; z-index: 2; opacity: 0.8;">
                               <v-progress-circular
                                 style="position: absolute; right: 0; left: 0; margin: auto; top: 0; bottom: 0;"
                                 color="primary"
                                 indeterminate :size="40" :width="2"></v-progress-circular>
                             </v-layout>


                           <v-layout
                             column
                             class="elevation-5 ma-2 pa-2"
                             :style="{ border: !image.isPerspectiveViewExists ? '4px solid #ff8989' : '4px solid #ffffff' }"
                           >
                             <v-flex><div class="caption">{{image.originalFileName}}</div></v-flex>
                             <v-flex> <div class="caption">{{image.photographerUserName}}</div></v-flex>
                             <v-flex><div class="caption">{{image.shootingFormatName}}</div></v-flex>
                             <v-flex><div class="caption">{{convertTimeToDate(image.photoFileCreateDate)}}</div></v-flex>
                            <v-flex>
                              <div
                                :style="{
                                  width:'100%',
                                  height:'150px',
                                  backgroundSize: 'contain',
                                  backgroundPosition: 'center center',
                                  backgroundImage: 'url(' + get_url_image(image.photoFileCodePreview) + ')' }"
                                style="width:100%;height: 100px;"
                              >

                              </div>
                              <!--<v-img-->
                                <!--:src="get_url_image(image.photoFileCodePreview)"-->
                                <!--class="grey lighten-2 ma-0 elevation-0"-->
                              <!--/>-->
                            </v-flex>

                             <v-flex>

                               <v-layout row>
                                 <v-flex style="width: 100%">
                                   <template v-if="in_listCheckedPhoto(image.photoCode)">
                                     <v-btn
                                       @click="listCheckedPhoto_addItem(image.photoCode, item.photoStatusName)"
                                       small icon>
                                       <v-icon>check_box_outline_blank</v-icon>
                                     </v-btn>
                                   </template>
                                   <template v-else>
                                     <v-btn
                                       @click="listCheckedPhoto_delItem(image.photoCode)"
                                       small icon>
                                       <v-icon color="blue">check_box</v-icon>
                                     </v-btn>
                                   </template>
                                 </v-flex>
                                 <v-flex>
                                   <v-tooltip bottom>
                                     <v-btn slot="activator" small icon @click="showOriginal(image.photoFileCodeMain)">
                                       <v-icon color>crop_original</v-icon>
                                     </v-btn>
                                     <span>Оригинал</span>
                                   </v-tooltip>
                                 </v-flex>
                                 <v-flex>
                                   <v-tooltip bottom>
                                     <v-btn slot="activator" small icon @click="show_dialog_historyImages(image.photoFileCodeMain)">
                                       <v-icon color>image</v-icon>
                                     </v-btn>
                                     <span>История</span>
                                   </v-tooltip>
                                 </v-flex>
                               </v-layout>

                             </v-flex>
                           </v-layout>

                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>

            </div>
          </div>
        </div>
      </div>

    </div>

    <v-dialog v-model="dialog__changeRequest_wareCardStatus" max-width="300px">
      <v-card>
        <v-card-title class="headline red--text">Вы действительно хотите изменить статус?</v-card-title>
        <v-card-actions>
          <v-btn color="green darken-1" dark @click="dialog__changeRequest_wareCardStatus=false; wareCardStatus=null">
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" dark @click="change__wareCardStatus">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog__deletePhoto" width="350">
      <v-card>
        <v-card-title class="headline red--text" primary-title>Уверены что хотите удалить фотографии?</v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" flat @click="dialog__deletePhoto = false">нет</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" dark @click="deletePhoto">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_historyImages" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogHistoryImagest
        v-on:close-dialog="hide_dialog_historyImages"
        :dialog_historyImages="dialog_historyImages"
        :historyImagesId="historyImagesId"
      ></dialogHistoryImagest>
    </v-dialog>

    <v-dialog v-model="dialog_originalImage" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogFullsizePhoto
        :photoId="dialog_originalImage_photoId"
        v-on:close-dialog="dialog_originalImage = false"
        :dialog_originalImage="dialog_originalImage"
      ></dialogFullsizePhoto>
    </v-dialog>

    <v-dialog v-model="dialog_perspective" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogPerspective
        v-on:close-dialog="dialog_perspective = false"
        :dialog_perspective="dialog_perspective"
        :infoData="infoData"
        style="background: #fff"
      ></dialogPerspective>
    </v-dialog>

  </div>

</template>

<script>
  import {convertDate} from "../utils/mixins/date"

  import dialogHistoryImagest from "./dialog_history-images"
  import dialogFullsizePhoto from "./dialog-fullsize-photo"
  import dialogPerspective from "./dialog-perspective"
  // import ChangeColorModelComponent from "@/components/change-colorModel"

  export default {
    name: 'CardsGood',
    mixins: [convertDate],
    props: ["dialog_edit", "selected"],
    components:{
      dialogHistoryImagest: dialogHistoryImagest,
      dialogFullsizePhoto: dialogFullsizePhoto,
      dialogPerspective: dialogPerspective,
      // ChangeColorModelComponent: ChangeColorModelComponent
    },
    data: () => ({
      loading: false,

      key: '',
      infoHeaders: [],
      infoData: {},
      cards: [],

      wareCardStatus: null,

      dialog__changeRequest_wareCardStatus: false,
      dialog__deletePhoto: false,
      dialog_historyImages: false,
      dialog_perspective: false,

      //Выделение фотографий
      listCheckedPhoto: [],
      nameBlockCheckedPhoto: "",

      historyImagesId: null,

      idCard: null,

      dialog_originalImage: false,
      dialog_originalImage_photoId: null

    }),
    mounted: function(){
      this.autoReloadGo()
    },
    watch: {
      dialog_edit: function (newValue) {
        if (newValue) {
          this.loading = true
          this.idCard = this.$props.selected.wareCardInternalNumber
          this.get_info()
        }
      },
      wareCardStatus: function (newValue) {
        if (newValue !== null) {
          this.dialog__changeRequest_wareCardStatus = true
        }

      }
    },
    methods: {

      showOriginal: function(idPhoto){
        this.dialog_originalImage_photoId = idPhoto
        this.dialog_originalImage = true
        console.log( this.cards)
        console.log(idPhoto)
      },

      autoReloadGo: function(){
        setTimeout(()=>{
          if (this.dialog_edit === true){
            this.get_blocks()
          }
          this.autoReloadGo()
        },30000)

      },


      get_info: function () {
        this.$store.dispatch(
          "wareCard/getInfo_",
          {id: this.idCard}
        )
          .then((res) => {
            this.key = res.key
            this.infoHeaders = res.headers
            this.infoData = res.data

            this.get_blocks()
          })
          .catch(err => {
            console.log(err)
          })
      },
      get_blocks: function(){
        this.$store.dispatch(
          "wareCard/getBlocks_",
          {id: this.idCard}
        ).then((res) => {
          this.cards = res
          this.loading = false
        })
      },

      change__wareCardStatus: function () {
        this.$store.dispatch(
          "wareCard/changeStatusCard_",
          {
            wareCardCode: this.infoData.wareCardCode,
            wareCardStatusCode: this.wareCardStatus
          }
        ).then(() => {
          this.get_info()
          this.dialog__changeRequest_wareCardStatus = false
          this.$emit('update-list')
        })
      },
      get_url_image: function (id) {
        console.log('dialog-card')
        return "api/photoFile/photoFile/" + id
      },
      in_listCheckedPhoto: function (id) {
        var asd = this.listCheckedPhoto.filter((el) => {
          if (el === id) {
            return true;
          }
        })
        return !(asd.length > 0)
      },
      listCheckedPhoto_addItem: function (id, statusName) {
        if (this.nameBlockCheckedPhoto !== statusName) {
          this.listCheckedPhoto = []
        }
        this.listCheckedPhoto.push(id)
        this.nameBlockCheckedPhoto = statusName
      },
      listCheckedPhoto_delItem: function (id) {
        this.listCheckedPhoto = this.listCheckedPhoto.filter((el) => {
          if (el !== id)
            return true
        })
      },
      setPhotoNewStatus: function(id){
        this.$store.dispatch(
          "wareCard/setNewStatus_",
          { id: id, list: this.listCheckedPhoto }
        )
          .then(() => {
            this.get_info()
            this.listCheckedPhoto = []
            this.nameBlockCheckedPhoto = ""
          })
      },
      deletePhoto: function () {
        console.log(this.listCheckedPhoto)
        this.$store.dispatch(
          "wareCard/deletePhoto_",
          { list: this.listCheckedPhoto }
        )
          .then(() => {
            this.get_info()
            this.listCheckedPhoto = []
            this.dialog__deletePhoto = false
          })
      },
      show_dialog_historyImages: function (id) {
        this.historyImagesId = id
        this.dialog_historyImages = true
      },
      hide_dialog_historyImages: function () {
        this.dialog_historyImages = false
        this.historyImagesId = null
      },
      show_dialog_original_images: function(id){
        console.log("api/photoFile/photoFile/" + id)
      },

      successSaveColormodel: function(){
        this.get_info()
        this.$emit('update-list')
      }

    },
    computed: {
      photoStatusWorkflowList: function () {
        return this.cards.filter((el) => {
          console.log(el.photoStatusName)
          if (el.photoStatusName === this.nameBlockCheckedPhoto)
            return true
        })[0].photoStatusWorkflowList
      },
      showDeleteBlock: function (){
        var index = this.infoData.wareCardPermissions.indexOf("delete_photo");
        if (index !== -1) {
          return true
        }
        return false
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


