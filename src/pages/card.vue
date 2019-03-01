<template>
  <div class="app__page">

    <div class="app__subHeader">
      <v-toolbar class="elevation-3" height="40" color="white">
        <v-btn @click="_go2Back" small class="pr-3"><v-icon>chevron_left</v-icon>{{$t('BTN.BACK')}}</v-btn>
        <v-toolbar-title>
          <div class="body-2 pb-0 blue--text">{{$t('EDIT_CARD')}} №{{$route.params.id}}</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items >
          <v-menu transition="slide-x-transition" left v-if="listCheckedPhoto.length > 0">
            <v-btn slot="activator" dark color="blue">
              <v-icon>check_box</v-icon>
              <span class="body-2 pl-2">{{listCheckedPhoto.length}}</span>
            </v-btn>
            <v-list dense>
              <v-list-tile v-for="item in  photoStatusWorkflowList" :key="item.nextPhotoStatusCode" @click="setPhotoNewStatus(item.nextPhotoStatusCode)">
                <v-icon color="blue" class="pr-2">label</v-icon>
                <v-list-tile-title class="blue--text">{{item.nextPhotoStatusName}}</v-list-tile-title>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile @click="dialogDeletePhoto = true">
                <v-icon color="red" class="pr-2">delete_forever</v-icon>
                <v-list-tile-title class="red--text">Удалить</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
    </div>

    <div class="app__content">
      <div class="app__content_left pa-2">
        <!--percentageOfCompletionByModel-->
        <!--<v-progress-linear-->
          <!--height="5"-->
          <!--:value="infoData['percentageOfCompletionByModel']"-->
        <!--&gt;</v-progress-linear>-->

        <!--percentageOfCompletionByMannequin-->
        <!--<v-progress-linear-->
          <!--height="5"-->
          <!--:value="infoData['percentageOfCompletionByMannequin']"-->
        <!--&gt;</v-progress-linear>-->

        <v-card class="mb-2 pa-0" v-for="h in infoHeaders" :key="h" v-if="h !== 'percentageOfCompletionByModel' && h !== 'percentageOfCompletionByMannequin'">
          <v-card-text class="pa-2 caption blue lighten-4">{{$t('TABLE_KEY.' + key + '.' + h)}}</v-card-text>
          <v-card-text class="pa-0 pt-2 pb-2 pl-3 body-2">

            <template v-if="h === 'wareCardCreateDate' ">
              {{convertTimeToDate(infoData[h])}}
            </template>
            <template v-else-if="h === 'barcodeList'">
              <ul>
                <li v-for="item in infoData[h]">{{item}}</li>
              </ul>
            </template>
            <template v-else-if="h === 'articleNumberList' ">
              <ul>
                <li v-for="item in infoData[h]">{{item}}</li>
              </ul>
            </template>
            <template v-else>
              {{infoData[h]}}
            </template>

          </v-card-text>
        </v-card>

      </div>
      <div class="app__content_center elevation-0 pa-2">

        <v-progress-circular v-if="loading" :size="30" :width="2" color="blue" indeterminate class="ma-2"></v-progress-circular>
        <v-expansion-panel v-else focusable>
          <v-expansion-panel-content v-for="(item,i) in cards" :key="i">
            <div slot="header">
              <span class="title blue--text">{{item.photoStatusName}}</span><br/>
              <span class="caption grey--text" >{{$t('TOTAL_PHOTOS')}}: {{item.photoList.length}} шт.</span>
            </div>
            <v-card>
              <v-container grid-list-sm fluid class="pt-2 pl-2 pr-2">
                <v-layout row wrap>
                  <v-flex v-for="(image, index) in item.photoList" :key="index" xs3 d2-flex class="elevation-0 pa-2">
                    <v-card fl23at ti3le class="d1-flex blue lighten-4 elevation-1">
                      <v-card-title primary-title class="pa-0 pl-1 pt-1"><div class="caption">{{image.originalFileName}}</div></v-card-title>
                      <v-card-title primary-title class="pa-0 pl-1"><div class="caption">{{image.photographerUserName}}</div></v-card-title>
                      <v-card-title primary-title class="pa-0 pl-1"><div class="caption">{{image.shootingTypeName}}</div></v-card-title>
                      <v-card-title primary-title class="pa-0 pl-1 pb-1"><div class="caption">{{convertTimeToDate(image.photoCreateDate)}}</div></v-card-title>
                    </v-card>
                    <v-card flat tile class="d-flex blue elevation-1">
                      <v-img
                        :src="get_url_image(image.previewPhotoFileCode)"
                        aspect-ratio="1"
                        class="grey lighten-2 ma-0"
                      >



                        <v-btn
                          v-if="in_listCheckedPhoto(image.photoCode)"
                          @click="listCheckedPhoto_addItem(image.photoCode, item.photoStatusName)"
                          small icon>
                          <v-icon>check_box_outline_blank</v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          @click="listCheckedPhoto_delItem(image.photoCode)"
                          small icon>
                            <v-icon color="blue">check_box</v-icon>
                        </v-btn>

                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>



                      </v-img>


                       <!--<v-card-actions>-->
                        <!--{{image.originalFileName}}-->
                        <!--{{image.photographerUserName}}-->
                        <!--{{image.shootingTypeName}}-->
                        <!--{{image.photoCreateDate}}-->
                      <!--</v-card-actions>-->
                    </v-card>

                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </div>
    </div>

    <v-dialog
      v-model="dialogDeletePhoto"
      width="350"
    >
      <v-card>
        <v-card-title class="headline red--text" primary-title>Уверены что хотите удалить фотографии?</v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" flat @click="dialogDeletePhoto = false">нет</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red" dark @click="deletePhoto">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import {convertDate} from "../utils/mixins/date"
  export default {
    name: 'CardsGood',
    mixins: [convertDate],
    data: () => ({

      key: "",

      dialogDeletePhoto : false,

      loading: true,

      infoHeaders : [],
      infoData : {},

      cards: [],

      //Выделение фотографий
        listCheckedPhoto: [],
        nameBlockCheckedPhoto: ""

    }),
    mounted () {
      this.get_info()
    },
    methods: {
      get_info: function () {
        this.$store.dispatch(
          "wareCard/getInfo_",
          { id: this.$route.params.id }
        )
          .then((res) => {
            this.key = res.key
            this.infoHeaders = res.headers
            this.infoData = res.data
            console.log(res);

            this.$store.dispatch(
              "wareCard/getBlocks_",
              { id: this.$route.params.id }
            ).then((res) => {
              this.cards = res
              setTimeout(()=>{
                this.loading = false
              },500)

            })

          })
          .catch(err => {
            console.log(err)
          })
      },
      get_url_image: function(id){
        console.log('card')
        return "api/photoFile/photoFile/" + id
      },

      //Кнопка назад
      _go2Back : function(){
        // this.$router.push({name:'list'})
        this.$router.back()
      },
      listCheckedPhoto_addItem: function(id,statusName){
        if ( this.nameBlockCheckedPhoto !== statusName ){
          this.listCheckedPhoto = []
        }
        this.listCheckedPhoto.push(id)
        this.nameBlockCheckedPhoto = statusName
      },
      listCheckedPhoto_delItem: function(id){
        this.listCheckedPhoto = this.listCheckedPhoto.filter((el) => {
          if (el !== id)
            return true
        })
      },
      in_listCheckedPhoto: function (id) {
        var asd = this.listCheckedPhoto.filter((el) => {
          if (el === id){
            return true;
          }
        })
        return !(asd.length > 0)
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
            this.dialogDeletePhoto = false
          })
      }

    },
    computed: {
      photoStatusWorkflowList: function(){
        return this.cards.filter((el) => {
          if (el.photoStatusName === this.nameBlockCheckedPhoto)
            return true
        })[0].photoStatusWorkflowList
      }
    }


  }
</script>

