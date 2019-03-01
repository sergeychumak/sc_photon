<template>

  <div style="width: 100%; height:100%; padding: 40px;">
    <div style="width:100%; margin:0 auto">

      <v-toolbar color="darken-3" app fixed1 dense>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Настройка ракурсов</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="save">
          <v-icon>save</v-icon>
        </v-btn>
      </v-toolbar>

      <v-content class="pa-4">
        <v-layout column>
          <v-flex class="perspectiveWrap">
            <template v-for="item in perspective_list">
              <template v-if="item.item">

                <div class="perspectiveItem">
                  <v-layout column fill-height>
                    <v-flex shrink class="caption">{{item.perspectiveViewName}}</v-flex>
                    <v-flex
                      :key="item.perspectiveViewCode"
                      :style="{ backgroundImage: 'url(' + get_url_image(item.item.photoFileCode) + ')', backgroundSize: 'contain', backgroundPosition: 'center'}"
                    ></v-flex>
                    <v-flex shrink>
                      <div class="perspe2ctiveItemDelete">
                        <v-btn small icon @click="deletePhotoPerspective(item)"><v-icon small>delete</v-icon></v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </div>


                <!---->
                <!--<v-card>-->
                  <!--<v-card-title primary-title>-->
                    <!--<div class="caption">{{item.perspectiveViewName}}</div>-->
                  <!--</v-card-title>-->
                  <!--<v-card-actions>-->
                    <!--<div class="perspectiveItemDelete" @click="deletePhotoPerspective(item)">-->
                      <!--<v-btn small icon><v-icon small>delete</v-icon></v-btn>-->
                    <!--</div>-->
                  <!--</v-card-actions>-->
                <!--</v-card>-->

                <!--<div-->
                  <!--class="perspectiveItem"-->
                  <!--:key="item.perspectiveViewCode"-->
                  <!--:style="{ backgroundImage: 'url(' + get_url_image(item.item.photoFileCode) + ')', backgroundSize: 'contain', backgroundPosition: 'center'}"-->
                <!--&gt;-->
                  <!--<div class="caption">{{item.perspectiveViewName}}</div>-->



                <!--</div>-->

              </template>
              <template v-else>
                <drop
                  :data-dropId="`${item.perspectiveViewCode}`"
                  class="perspectiveItem drop"
                  @drop="handleDrop"
                  :key="item.perspectiveViewCode">
                    <div class="caption">{{item.perspectiveViewName}}</div>
                </drop>
              </template>
            </template>


          </v-flex>
          <v-flex class="perspectiveWrap">
            <drag
              class="perspectiveItem drag"
              :transfer-data="{ item }"
              v-for="item in perspective_photo_file_list"
              :key="item.perspectiveViewCode"
              :style="{ backgroundImage: 'url(' + get_url_image(item.photoFileCode) + ')', backgroundSize: 'contain', backgroundPosition: 'center'}"
            ></drag>
          </v-flex>
          <v-flex>

          </v-flex>
        </v-layout>
      </v-content>

    </div>

  </div>

</template>

<script>


  import { Drag, Drop } from 'vue-drag-drop';

  export default {
    name: '',
    props: ["dialog_perspective", "infoData"],
    data: function(){
      return {
        draggable: 'Drag Me',
        perspective_list: [],
        perspective_photo_file_list: [],
        perspective_chosen_photofile_list: []
      }
    },
    components: {
      drag: Drag,
      drop: Drop
    },
    mounted: function(){},
    methods: {

      handleDrop(data, event) {
        let dropid = parseInt(event.target.dataset.dropid)
        let res = this.perspective_list.map(el=>{
           if (el.perspectiveViewCode === dropid){
             el.item = data.item
           }
           return el
        })
        this.perspective_list = res


        let photoFileCode = data.item.photoFileCode
        res = this.perspective_photo_file_list.filter(el=>{
          if (el.photoFileCode === photoFileCode){
            return false
          }
          return true
        })
        this.perspective_photo_file_list = res
      },

      deletePhotoPerspective(item){

        this.perspective_photo_file_list.push(item.item)

        let res = this.perspective_list.map(el=>{
          if (el.perspectiveViewCode === item.perspectiveViewCode){
            delete el.item
          }
          return el
        })
        this.perspective_list = res

      },

      save: function(){
        let perspectiveMappingList = []
        this.perspective_list.map((el,index)=> {
          if (el.item){
            perspectiveMappingList.push(
              {
                "sitesGroupOrderForeignCode": el.sitesGroupOrderForeignCode,
                "perspectiveViewCode": el.perspectiveViewCode,
                "photoFileCode": el.item.photoFileCode
              }
            )
          }
        })
        this.$store.dispatch("SAVE_PHOTOFILE_PERSPECTIVE",{
          "accountUserCode": 0,
          "perspectiveMappingList": perspectiveMappingList,
          "wareCardCode": this.infoData.wareCardCode
        }).then(res=>{
        })
      },

      get_url_image: function (id) {
        console.log('dialog-perspective')
        return "api/photoFile/photoFile/" + id
      },

    },
    watch: {
      'dialog_perspective': function(newValue){
        if (newValue){
          this.$store.dispatch("GET_PERSPECTIVE_LIST_BY_WARECARD", this.infoData.wareCardCode).then(res=>{
            this.perspective_list = res.data
            this.$store.dispatch("GET_PERSPECTIVE_CHOSEN_PHOTOFILE_LIST", this.infoData.wareCardCode).then(res=>{
              res.data.map(el=>{
                let index = null
                this.perspective_list.map((perspective_list_el,perspective_list_index)=>{
                  if (perspective_list_el.sitesGroupOrderForeignCode === el.sitesGroupOrderForeignCode){
                    index = perspective_list_index
                  }
                })
                if (index !== null){
                  this.$set(this.perspective_list[index],'item',el)
                }else{
                  console.warn("!!", el, perspective_list_el)
                }
              })
            })
          })
          this.$store.dispatch("GET_PERSPECTIVE_PHOTO_FILE_SUGGESTION_LIST", this.infoData.wareCardCode).then(res=>{
            this.perspective_photo_file_list = res.data
          })

        }
      }
    }
  }


</script>

<style>

  .perspectiveWrap{
    height: 300px;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;
    margin-bottom: 20px;
  }

  .perspectiveItem{
    border: 1px dashed #aaa;
    width: 200px;
    height: 250px;
    display: inline-block;
    flex: 0 0 auto;
    margin-right: 20px;
    padding: 5px;
    position: relative;
  }

  .smooth-dnd-container{
    width: 100%;
    height: 100%;
  }

  .perspectiveItemDelete{
    background: #fff;
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
  }

</style>

