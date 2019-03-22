<template>
  <v-layout column>

    <v-flex shrink>

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / Список карточек
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">

        <v-tooltip bottom v-if="selected.length > 0">
          <v-btn
            @click="downloadRetouch"
            flat icon color="orange darken-4" slot="activator"><v-icon color="orange darken-4">move_to_inbox</v-icon></v-btn>
          <span>Скачать ретушь</span>
        </v-tooltip>

        <v-menu transition="slide-x-transition" left v-if="workflow.length > 0">
          <v-btn slot="activator" icon flat color="orange darken-4"><v-icon color="orange darken-4">menu</v-icon></v-btn>
          <v-list dense>
            <v-list-tile v-for="item in workflow" :key="item.nextWareCardStatusCode" @click="setNewWareCardStatus(item.nextWareCardStatusCode)">
              <v-list-tile-title>{{$t('STATUS.KT.' + item.nextWareCardStatusName)}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <!--ADD-->
        <v-tooltip bottom>
          <v-btn
            @click="$router.push({name:'add-new-card'})"
            flat icon color="blue" slot="activator"><v-icon color="blue">library_add</v-icon></v-btn>
          <span>Добавить карточку</span>
        </v-tooltip>

        <!--SYNC-->
        <!--<v-tooltip bottom >-->
          <!--<v-btn-->
            <!--v-if="autoReload"-->
            <!--@click="_autoReloadToggle(false)"-->
            <!--color="blue"-->
            <!--slot="activator"-->
            <!--icon flat>-->
            <!--<v-badge color="white">-->
              <!--<span slot="badge" class="caption brown&#45;&#45;text text&#45;&#45;lighten-4">{{autoReloadSec}}</span>-->
              <!--<v-icon color="blue">sync</v-icon>-->
            <!--</v-badge>-->
          <!--</v-btn>-->
          <!--<v-btn-->
            <!--v-else-->
            <!--@click="_autoReloadToggle(true)"-->
            <!--color="blue"-->
            <!--slot="activator"-->
            <!--icon flat>-->
            <!--<v-icon color="blue">sync_disabled</v-icon>-->
          <!--</v-btn>-->
          <!--<span v-if="autoReload">Выключить автообновление</span>-->
          <!--<span v-else>Включить автообновление</span>-->
        <!--</v-tooltip>-->

        <!--PERPAGE-->
        <v-menu transition="slide-x-transition" left>
          <v-btn slot="activator" icon flat color="blue">{{rowsLimit}}</v-btn>
          <v-list dense>
            <v-list-tile v-for="(item,index) in [15,30,50,100,300]" :key="index" @click="rowsLimit = item">
              <v-list-tile-title>{{item}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <template >
        <cardListFilter
          ref="cardListFilter"
          class="mt-2 mb-2"
          v-on:detected-change="cardListFilterDetectedChange"
        ></cardListFilter>
      </template>

      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
        height="2"
        color="blue"
        class="pa-0 ma-0"
        style="position: absolute; top: 0px; left: 0; right: 0;"
      ></v-progress-linear>

    </v-flex>

    <v-flex class="vhHeight" style="overflow: hidden; background: #fff"  >

      <div class="isTable">
        <div class="isTable__content" id="scroll-target">
          <div class="isTable__contentWrap">
            <v-layout
              column
              align-center
              justify-center
              class="isTable__contentLayout overflowAuto"
            >
              <h3 class="pt-3" v-if="data.length === 0">Нет данных</h3>
              <!--TABLE-->
              <v-data-table
                v-if="data.length > 0"
                v-model="selected"
                :headers="headers"
                :items="data"
                hide-actions
                item-key="wareCardInternalNumber"
              >
                <template slot="headers" slot-scope="props">
                  <tr ref="thead">
                    <td class="pa-0 ma-0 pl-2" style="width: 40px;">
                      <v-checkbox v-model="selectedAll" primary hide-details></v-checkbox>
                    </td>
                    <td class="ma-0 pa-0" style="width: 40px;">

                    </td>
                    <td v-for="itemHeader in headers">
                      <div style="white-space:nowrap;" class="caption">{{ itemHeader.text }}</div>
                    </td>
                  </tr>
                </template>
                <template slot="items" slot-scope="props">
                  <tr :active="props.selected" >
                    <td
                      class="pa-0 ma-0" style="width: 40px;"
                    >
                      <v-checkbox class="pa-0 ma-0 pl-2" v-model="props.selected" primary hide-details></v-checkbox>
                    </td>
                    <td class="pa-0 ma-0" style="border-right: 1px solid #eee;border-left: 1px solid #eee;">
                      <v-btn icon flat @click="$router.push({name:'card-edit', params :{id:props.item.wareCardInternalNumber}})" color="primary">
                        <v-icon small>edit</v-icon>
                      </v-btn>
                    </td>
                    <td v-for="itemHeader in headers">
                      <span :style="{whiteSpace: itemHeader.key === 'wareColorModelName' ? '': 'nowrap'}">
                        {{ props.item[itemHeader.key] }}
                      </span>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-layout>
          </div>
        </div>
      </div>
    </v-flex>

  </v-layout>

</template>

<script>

  import {mapGetters, mapActions} from 'vuex'
  import {convertDate} from "@/utils/mixins/date"

  import cardListFilter from "@/components/cardListFilter"

  export default {
    name: 'card-list',
    mixins: [convertDate],
    components: {
      cardListFilter: cardListFilter
    },
    data: function(){
      return {
        loading: true,
        rowsLimit: 15,
        headers: [],
        data: [],
        workflow: [],
        selected:[],
        selectedAll: false
      }
    },
    methods: {

      ...mapActions("wareCardController", {
        getWareCardTableHeader: "getWareCardTableHeader",
        getWareCardList: "getWareCardList",
        updateWareCardStatus: "updateWareCardStatus"
      }),

      ...mapActions("retouchController", {
        validateZipFileRequest: "validateZipFileRequest",
        getRetouchZipFile: "getRetouchZipFile"
      }),


      cardListFilterDetectedChange: function(payload){
        this.getData(payload)
      },
      getHeader: function(){
        return new Promise((resolve)=>{
          this
            .getWareCardTableHeader()
            .then(res => {
              this.headers = this.prepareHeader(res.headers, res.key)
              resolve()
            })
        })
      },
      prepareHeader: function (data, key) {
        var res = [];
        data.forEach((el) => {
          res.push({
            key: el,
            text: this.$t('TABLE_KEY.' + key + "." + el),
            value: el,
            sortable: false
          })
        })
        return res;
      },
      getData: function(formData = {}){
        this.loading = true
        var payload = Object.assign({}, { "rowsLimit": this.rowsLimit }, formData)
        this
          .getWareCardList(payload)
          .then(res=>{
            if (res.length > 0){
              // переводим и конверт даты
              res.map( (el) => {
                el.wareCardStatusName = this.$t('STATUS.KT.' + el.wareCardStatusName)
                el.wareCardCreateDate = this.convertTimeToDate(el.wareCardCreateDate)
              })
            }
            this.data = res
            setTimeout(()=>this.loading = false,1000)
            this.$router.push({name: "card-list", query: payload})
          })
      },
      setNewWareCardStatus: function(newStatusCode){
        let wareCardCodeList = []
        this.selected.map((el)=>{
          wareCardCodeList.push(el.wareCardCode)
        })
        this.updateWareCardStatus({
          wareCardCodeList: wareCardCodeList,
          wareCardStatusCode: newStatusCode
        }).then(()=>{
          this.selected = []
          this.$refs.cardListFilter.detectedChange()
        })
      },
      downloadRetouch: function(){

        var
          wareCardCodeList = [],
          photographerList = [],
          addParamStringPhotographerUserCodeList = "photographerUserCodeList=",
          addParamStringWareCardCodeList = "wareCardCodeList="

        // if (this.form.photographerUserCode)
        //   photographerList.push(this.form.photographerUserCode)

        this.selected.map(el=>{ wareCardCodeList.push(el.wareCardCode) })

        addParamStringPhotographerUserCodeList =
          addParamStringPhotographerUserCodeList + photographerList.join("&photographerUserCodeList=")

        addParamStringWareCardCodeList =
          addParamStringWareCardCodeList + wareCardCodeList.join("&wareCardCodeList=")

        this.validateZipFileRequest({
          photographerUserCodeList: photographerList,
          wareCardCodeList: wareCardCodeList
        })
        .then(()=>{
          this.selected = []
          // window.open(
          //   this.getUrl('zipFile.retouch.get')+
          //   '?' + addParamStringPhotographerUserCodeList +
          //   '&' + addParamStringWareCardCodeList
          //   , '_blank');
        })

      },
    },
    watch: {
      "rowsLimit": function(){
        this.$refs.cardListFilter.detectedChange()
      },
      "selected": function(newValue){
        if (newValue.length >= 1){
          // Проверяем одинаковые ли статусы имеют выделеные КТ
          let res = {}
          newValue.map((el)=>{
            res[el.wareCardStatusName] = el
          })
          if (Object.keys(res).length == 1){
            this.workflow = res[Object.keys(res)[0]].wareCardStatusWorkflowDtoList
          } else {
            this.workflow = []
          }
        }else{
          this.workflow = []
        }
      },
      "selectedAll": function(newValue){
        if (newValue){
          this.selected = this.data
        }else{
          this.selected = []
        }
      }
    },
    mounted () {
      this.getHeader().then(()=>{
        if (this.$route.query['rowsLimit']){
          this.rowsLimit = this.$route.query['rowsLimit']
        }
        this.$refs.cardListFilter.fillDataByRouter()
      })
    },
    updated: function(){
      this.$emit('sync-content')
    }
  }

</script>

