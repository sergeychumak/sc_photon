<template>
  <div>
    <!-- NAME -->
    <div ref="isHook__Name" class="blue--text">
      / Просмотр фотографии с id: {{$route.params.id}}
    </div>

    <!-- ACTION -->
    <div ref="isHook__Actions">
      <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
    </div>

    <SvgImage
      :image = "getUrlImage(this.$route.params.id)"
    ></SvgImage>
  </div>

  <!--<v-layout align-center justify-center class="overflowAuto">-->
    <!--<v-flex shrink >-->

      <!--&lt;!&ndash; NAME &ndash;&gt;-->
      <!--<div ref="isHook__Name" class="blue&#45;&#45;text">-->
        <!--/ Просмотр фотографии с id: {{$route.params.id}}-->
      <!--</div>-->

      <!--&lt;!&ndash; ACTION &ndash;&gt;-->
      <!--<div ref="isHook__Actions">-->
        <!--<v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>-->
      <!--</div>-->

      <!--<div-->
        <!--:style="styleObj"-->
      <!--&gt;</div>-->

      <!--<v-btn-->
        <!--@click="zoom = zoom + incremet"-->
        <!--style="position: absolute; top:20px; left:20px;" icon1 large>-->
        <!--<v-icon large>zoom_in</v-icon>-->
      <!--</v-btn>-->

      <!--<v-btn-->
        <!--@click="zoom = zoom - incremet"-->
        <!--style="position: absolute; top:70px; left:20px;" icon1 large>-->
        <!--<v-icon large>zoom_out</v-icon>-->
      <!--</v-btn>-->

    <!--</v-flex>-->
  <!--</v-layout>-->


</template>

<script>
  import SvgImageCompontn from '@/components/build-1/svg-image'
  export default {
    name: 'image-show',
    components: {
      SvgImage: SvgImageCompontn
    },
    data: function(){
      return {
        zoom: 1,
        incremet: 0.5
      }
    },
    methods:{
      getUrlImage: function (id) {
        return "api/photoFile/photoFile/" + id
      },
      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      }
    }
  }

</script>

