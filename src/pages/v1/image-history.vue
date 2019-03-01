<template>
  <v-layout class="overflowAuto">
    <v-flex class="pa-5">

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / История фотографии
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">
        <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
      </div>

      <v-timeline align-top1>
        <v-timeline-item
          v-for="(item, i) in historyData"
          icon="radio_button_checked"
          :color="item.isMain? 'green': 'blue'"
          :key="i"
        >
          <span slot="opposite" >
            <div v-if="item.isMain"><span class="body-2 green--text">Главная фотография</span></div>
            <div><span class="body-2">Дата создания: </span> {{convertTimeToDate(item.photoFileCreateDate)}}</div>
            <div><span class="body-2">Формат / Тип: </span> {{item.photoFileFormatName}} / {{item.photoFileTypeName}}</div>
            <div><span class="body-2">Фотограф: </span> {{item.photographerUserName}}</div>
            <v-tooltip bottom>
              <v-btn
                @click="$router.push({name: 'image-show' , params: {id: item.photoFileCode}})"
                class="pa-0 ma-0"
                color="blue"
                slot="activator"
                small flat icon
              ><v-icon color="blue" class="pa-0 ma-0">crop_original</v-icon></v-btn>
              <span>Оригинал</span>
            </v-tooltip>
          </span>

          <template v-if="item.isMain">
            <v-card color="green" dark >
              <v-card-text class="white text--primary">
                <div
                  :style="{
                  width:'100%',
                  height:'300px',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundImage: 'url(' + getUrlImage(item.photoFileCodePreview) + ')',
                  border: '1px dashed #ddd'
                }"
                ></div>
              </v-card-text>
            </v-card>
          </template>
          <template v-else>
            <v-card color="blue" dark >
              <v-card-text class="white text--primary">
                <div
                  :style="{
                  width:'100%',
                  height:'300px',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundImage: 'url(' + getUrlImage(item.photoFileCodePreview) + ')',
                  border: '1px dashed #ddd'
                }"
                ></div>
                <v-btn color="blue" class="mx-0" small outline @click="setMain(item.photoFileCode)">Сделать главной</v-btn>
              </v-card-text>
            </v-card>
          </template>



        </v-timeline-item>
      </v-timeline>

    </v-flex>
  </v-layout>


</template>

<script>
  import {mapActions} from 'vuex'
  import {convertDate} from "@/utils/mixins/date"
  export default {
    name: 'image-show',
    mixins: [convertDate],
    data: function(){
      return {
        historyData: []
      }
    },
    mounted: function(){
      this.getHistory()
    },
    methods:{
      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest"
      }),
      setMain: function(id){
        this.POST_REQUEST({
          url: "image.setMain",
          data: {
            photoFileCode: id
          }
        })
          .then(res=>{
            this.getHistory()
            // console.log(res)
          })
      },
      getHistory: function () {
        this.GET_REQUEST({
          url: "image.history",
          appData: "/" + this.$route.params.id
        })
        .then(res=>{
          this.historyData = res.data
          console.log( res)
        })
      },
      getUrlImage: function (id) {
        return "api/photoFile/photoFile/" + id
      },
      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      },
    },
    computed:{}
  }

</script>

