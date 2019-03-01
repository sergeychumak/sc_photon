<template>
  <v-layout class="isCard" column>
    <v-flex shrink class="isCard__image" :style="styleImage"></v-flex>
    <v-flex class="isCard__buttons">
      <v-layout row>
        <v-flex>
          <v-btn v-if="checked" class="pa-0 ma-0" small icon @click="uncheck">
            <v-icon color="blue">check_box</v-icon>
          </v-btn>
          <v-btn v-else class="pa-0 ma-0" small icon @click="check">
            <v-icon>check_box_outline_blank</v-icon>
          </v-btn>
        </v-flex>
        <v-flex shrink>
          <v-tooltip bottom>
            <v-btn class="pa-0 ma-0" color="teal" slot="activator" small flat icon @click="history">
              <v-icon color="teal" class="pa-0 ma-0">image</v-icon>
            </v-btn>
            <span>История</span>
          </v-tooltip>
        </v-flex>
        <v-flex shrink>
          <v-tooltip bottom>
            <v-btn class="pa-0 ma-0" color="blue" slot="activator" small flat icon @click="original">
              <v-icon color="blue" class="pa-0 ma-0">crop_original</v-icon>
            </v-btn>
            <span>Оригинал</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex shrink>
      <v-layout column class="isCard__info">
        <v-flex>{{photographer}}</v-flex>
        <v-flex>{{createDate}} ( {{format}} )</v-flex>
        <v-flex>{{name}}</v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'card-component',
    props: {
      index: {
        type: Number,
        default : -1
      },
      checked: {
        type: Boolean,
        default : false
      },
      image: {
        type: String,
        default : ""
      },
      photographer: {
        type: String,
        default : "Нет информации"
      },
      createDate: {
        type: String,
        default : "Нет информации"
      },
      format: {
        type: String,
        default : ""
      },
      name: {
        type: String,
        default : "Нет имени"
      }
    },
    data: function(){
      return {
      }
    },
    methods: {
      check: function(){
        this.$emit('btn-check', this.index)
      },
      uncheck: function(){
        this.$emit('btn-uncheck', this.index)
      },
      history: function(){
        this.$emit('btn-history', this.index)
      },
      original: function(){
        this.$emit('btn-original', this.index)
      },
    },
    computed:{
      styleImage: function(){
        return {
          backgroundImage: 'url(' + this.image + ')'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .isCard {
    height: 270px;
    /*min-height: 240px;*/
    margin: 10px;
    &__image{
      width: 96%;
      height: 150px;
      margin: 2%;
      /*border: 1px dashed #eee;*/
      background-size: contain;
      background-position: 50% 50%;
    }
    &__buttons {
      padding: 0 2%;
    }
    &__info {
      margin: 2% 5%;
      font-size: 11px;
      color: #909090;
    }
  }
</style>
