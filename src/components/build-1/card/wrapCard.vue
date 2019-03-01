<template>
  <v-layout row wrap justify-center>
    <v-flex
      v-for="(image, index) in list"
      class="wrapCard">
      <Card
        class="card"
        :class="{
          'nonePerspective' : !image.isPerspectiveViewExists,
          'isChecked' : isCheced(image.photoCode)
        }"
        :index="index"
        :checked="isCheced(image.photoCode)"
        :image = "getUrlImage(image.photoFileCodePreview)"
        :photographer = "image.photographerUserName"
        :createDate = "convertTimeToDate(image.photoFileCreateDate)"
        :format = "image.shootingFormatName"
        :name = "image.originalFileName"
        v-on:btn-check="btnCheck"
        v-on:btn-uncheck="btnUnCheck"
        v-on:btn-history="btnHistory"
        v-on:btn-original="btnOriginal"
      ></Card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {convertDate} from "@/utils/mixins/date"
  import CardComponent from "@/components/build-1/card/card"
  export default {
    name: 'wrap-card-component',
    mixins: [convertDate],
    data: function(){
      return {
        photoStatusName : "",
        //selectedPhotoCode : []
      }
    },
    components:{
      Card: CardComponent
    },
    props: {
      sync_nameBlock: {
        type: String,
        default : ""
      },
      sync_listChecked: {
        type: Array,
        default : () => {
          return []
        }
      },
      list: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    mounted: function(){

    },
    methods:{
      btnCheck: function(index){
        this.photoStatusName = this.list[index].photoStatusName
        this.$emit("update:sync_nameBlock", this.photoStatusName)
        var new_listChecked = [...this.sync_listChecked]
        new_listChecked.push(this.list[index].photoCode)
        this.$emit("update:sync_listChecked", new_listChecked)
      },
      btnUnCheck: function(index){
        var id = this.list[index].photoCode
        var new_listChecked = [...this.sync_listChecked]
        new_listChecked = new_listChecked.filter((el) => {
          if (el !== id)
            return true
        })
        this.$emit("update:sync_listChecked", new_listChecked)
      },
      btnHistory: function(index){
        this.$router.push({name: 'image-history' , params: {
            id: this.list[index].photoCode
          }})
      },
      btnOriginal: function(index){
        this.$router.push({name: 'image-show' , params: {
          id: this.list[index].photoFileCodeMain
        }})
      },
      getUrlImage: function (id) {
        return "api/photoFile/photoFile/" + id
      },
      isCheced: function(photoCode){
        var res = this.sync_listChecked.filter((el) => {
          if (el === photoCode) {
            return true;
          }
        })
        return (res.length > 0)
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapCard {
    min-width: 210px;
    max-width: 210px;
    overflow: hidden;
  }

  .card {
    border:1px dashed #aaa;
    background: #fff;
  }

  .nonePerspective{
    border: 1px solid #f00;
    -webkit-box-shadow: inset 0px 0px 26px 0px rgba(255,0,0,0.1);
    -moz-box-shadow: inset 0px 0px 26px 0px rgba(255,0,0,0.1);
    box-shadow: inset 0px 0px 26px 0px rgba(255,0,0,0.1);
  }
  .isChecked{
    border: 1px solid #3357ff!important;
    background: #ebf8ff;
  }

</style>
