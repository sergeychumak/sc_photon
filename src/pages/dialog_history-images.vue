<template>

  <div class="vApplication">

    <div class="vApplication__page">

      <v-toolbar dense>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>История фотографии #{{historyImagesId}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <div class="app" style=" background: #fff">

        <div class="app__page">

          <div class="app__content">

            <v-container grid-list-sm fluid class="pt-2 pl-2 pr-2 ma-0">
              <v-layout row wrap>
                <v-flex
                  v-for="(image, index) in list"
                  :key="index" xs3 d2-flex class="elevation-0"
                >

                  <v-layout column wrap1 class="elevation-5 ma-2 pa-2">
                    <v-card>
                    <v-flex><div class="caption">{{image.photoFileFormat}}</div></v-flex>
                    <v-flex><div class="caption">{{convertTimeToDate(image.fileCreateDate)}}</div></v-flex>
                    <v-flex>
                       <v-img
                          :src="get_url_image(image.photoFileCode)"
                          aspect-ratio="1"
                          class="grey lighten-2 ma-0 elevation-0"
                        />

                    </v-flex>
                    </v-card>
                  </v-layout>


                </v-flex>
              </v-layout>
            </v-container>

          </div>
        </div>
      </div>

    </div>



  </div>

</template>

<script>
  import {convertDate} from "../utils/mixins/date"
  export default {
    name: 'CardsGood',
    props:["historyImagesId"],
    mixins: [convertDate],
    data: () => ({
      list: []
    }),
    watch: {
      historyImagesId: function(newValue){
        if (newValue){
          this.$store.dispatch(
            "wareCard/historyImage_",
            {
              photoFileCode: newValue
            }
          ).then((res) => {
            this.list = res
          })
        }
      }
    },
    methods: {
      get_url_image: function (id) {
        console.log('dialog-history')
        return "api/photoFile/photoFile/" + id
      },
    }
  }


</script>


