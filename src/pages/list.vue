<template>

  <div class="vApplication__page mt-5">

    <!--NAME-->
    <div ref="isHook__Name">
      / {{$t('CARD_LIST')}}
    </div>

    <!--ACTION-->
    <div ref="isHook__Actions">

      <v-btn v-if="showDownloadRetouchButton" @click="DownloadRetouch" color="primary" small outline>Выгрузить ретушь</v-btn>


      <v-btn v-if="showFilter" small color="primary" outline @click="search">Поиск</v-btn>

      <v-btn v-if="selected.length > 0" color="red" @click="clk__selected__clear" flat icon><v-icon>hdr_weak</v-icon></v-btn>
      <!--<v-btn v-if="selected.length == 1" color="green" @click.prevent="go2_edit" flat small >Редактировать</v-btn>-->
      <v-menu transition="slide-x-transition" left v-if="workflow_list.length >= 1">
        <v-btn slot="activator" icon flat color="teal"><v-icon>more_horiz</v-icon></v-btn>
        <v-list dense>
          <v-list-tile v-for="item in workflow_list" :key="item.nextWareCardStatusCode" @click="setNewWareCardStatus(item.nextWareCardStatusCode)">
            <v-list-tile-title>{{$t('STATUS.KT.' + item.nextWareCardStatusName)}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu transition="slide-x-transition" left>
        <v-btn slot="activator" icon flat color="teal">{{form.rowsLimit}}</v-btn>
        <v-list dense>
          <v-list-tile v-for="(item,index) in [15,30,50,100,300]" :key="index" @click="clk_change_rowsLimit(item)">
            <v-list-tile-title>{{item}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>


      <v-menu transition="slide-x-transition" left>
        <v-btn slot="activator" icon flat color="teal"><v-icon>menu</v-icon></v-btn>
        <v-list dense>

          <v-list-tile @click="dialog_addNew = true">
            <v-list-tile-action><v-icon color="primary">library_add</v-icon></v-list-tile-action>
            <v-list-tile-title>Создать карточку</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="autoReload = false" v-if="autoReload">
            <v-list-tile-action><v-icon color="primary">pause_circle_outline</v-icon></v-list-tile-action>
            <v-list-tile-title>Выключить автообновление</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="autoReload = true" v-else>
            <v-list-tile-action><v-icon color="primary">play_circle_outline</v-icon></v-list-tile-action>
            <v-list-tile-title>Включить автообновление</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="showFilter = false" v-if="showFilter">
            <v-list-tile-action><v-icon color="primary">search</v-icon></v-list-tile-action>
            <v-list-tile-title>Скрыть фильтры</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="showFilter = true" v-else>
            <v-list-tile-action><v-icon color="primary">search</v-icon></v-list-tile-action>
            <v-list-tile-title>Показать фильтры</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="dialog_params = true">
            <v-list-tile-action><v-icon color="primary">settings</v-icon></v-list-tile-action>
            <v-list-tile-title>Параметры</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="$router.push({name:'retouch-upload'})" color="green">
            <v-list-tile-action><v-icon color="green">photo_filter</v-icon></v-list-tile-action>
            <v-list-tile-title>Загрузить ретушер фотографий</v-list-tile-title>
          </v-list-tile>

        </v-list>
      </v-menu>


    </div>

    <v-card v-if="showFilter" class="elevation-0" color="teal lighten-5">
      <v-card-text class="pa-1 ma-0 pl-3 pr-3">

        <v-layout row wrap >
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Создал</div>
            <v-autocomplete
              v-model="form.user"
              solo
              dense
              class="mb-1"
              item-text="userName"
              item-value="accountUserCode"
              hide-details
              clearable
              :items="users_list"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Фотограф</div>
            <v-autocomplete
              v-model="form.photographer"
              solo
              dense
              class="mb-1"
              item-text="userName"
              item-value="accountUserCode"
              hide-details
              clearable
              :items="photographer_list"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Дата от</div>
            <v-menu
              :close-on-content-click="false"
              v-model="dateBeginElementShow"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                solo
                slot="activator"
                :value="computedDateBeginFormatted"
                persistent-hint
                hide-details
                readonly
                clearable
                @click:clear="__clearDateBegin"
              ></v-text-field>
              <v-date-picker v-model="form.dateBegin" no-title @input="dateBeginElementShow = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Дата до</div>
            <v-menu
              :close-on-content-click="false"
              v-model="dateEndElementShow"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                solo
                slot="activator"
                :value="computedDateEndFormatted"
                persistent-hint
                hide-details
                readonly
                clearable
                @click:clear="__clearDateEnd"
              ></v-text-field>
              <v-date-picker v-model="form.dateEnd" no-title @input="dateEndElementShow = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Статус</div>
            <v-select
              v-model="form.status"
              :items="status_list"
              item-text="name"
              item-value="code"
              solo
              hide-details
              clearable
            >
              <template slot="item" slot-scope="props">
                {{$t('STATUS.KT.' + props.item.name)}}
              </template>
              <template slot="selection" slot-scope="props">
                {{$t('STATUS.KT.' + props.item.name)}}
              </template>
            </v-select>
          </v-flex>
          <v-flex xs2 class="pa-1">
            <div class="caption blue-grey--text">Сайт</div>
            <v-autocomplete
              v-model="form.website"
              solo
              dense
              class="mb-1"
              item-text="name"
              item-value="gateSitesGroupCode"
              hide-details
              clearable
              :items="website_list"
            ></v-autocomplete>
          </v-flex>
          <!--<v-flex xs1 class="pa-1">-->
            <!--<div class="caption blue-grey&#45;&#45;text">&nbsp;</div>-->
            <!--<v-btn  color="primary" @click="search">Найти</v-btn>-->
          <!--</v-flex>-->
        </v-layout>

      </v-card-text>
    </v-card>

    <div class="isTable">
      <div class="isTable__content" id="scroll-target">

        <div class="isTable__contentWrap">

          <v-layout
            v-scroll:#scroll-target="onScroll"
            column
            align-center
            justify-center
            class="isTable__contentLayout"
          >
            <!--FAKE HEAD-->
            <transition name="fade">
              <div
                class="isTable__fakeHeads elevation-15"
                v-if="showFakeHead"
                :style="{top: offsetTop + 'px'}"
                ref="theadApps"
              >
                <div></div>
                <div></div>
                <div v-for="itemHeader in headers">{{ itemHeader.text }}</div>
              </div>
            </transition>

            <!--TABLE-->
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="data"
              hide-actions
              item-key="wareCardInternalNumber"
            >
              <template slot="headers" slot-scope="props">
                <tr ref="thead">
                  <td style="margin: 0;padding: 0 0 0 20px; width: 40px;">
                    <v-checkbox
                      v-model="selectedAll"
                      primary
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td style="margin: 0;padding: 0; width: 40px;"></td>
                  <td v-for="itemHeader in headers">
                    <div style1="white-space:nowrap;">{{ itemHeader.text }}</div>
                  </td>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr :active="props.selected" >
                  <td @click="props.selected = !props.selected" style="margin: 0;padding: 0 0 0 20px; width: 40px;">
                    <v-checkbox
                      v-model="props.selected"
                      primary
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td style="margin: 0;padding: 0; width: 40px;"><v-btn icon flat @click="clk_row(props.item)" color="primary"><v-icon small>edit</v-icon></v-btn></td>
                  <td v-for="itemHeader in headers" style1="white-space:nowrap;">
                    <template v-if="itemHeader.key === 'wareCardStatusName'">
                      {{$t('STATUS.KT.' + props.item[itemHeader.key])}}
                    </template>
                    <template v-else>
                      {{ props.item[itemHeader.key] }}
                    </template>
                  </td>
                </tr>
              </template>
            </v-data-table>

          </v-layout>

        </div>

      </div>

    </div>

    <v-dialog v-model="dialog_edit" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogEdit
        v-on:close-dialog="dialogEdit__close"
        v-on:update-list="get_body"
        :dialog_edit="dialog_edit"
        :selected="selected[0]"
      ></dialogEdit>
    </v-dialog>

    <v-dialog v-model="dialog_addNew" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogAddNew
        v-on:close-dialog="dialog_addNew = false; get_body()"
        :dialog_addNew="dialog_addNew"
        style="background: #fff"
      ></dialogAddNew>
    </v-dialog>

    <v-dialog v-model="dialog_params" fullscreen hide-overlay transition="dialog-bottom-transition">
      <dialogParams
        v-on:close-dialog="dialog_params = false"
        :dialog_params="dialog_params"
        style="background: #fff"
      ></dialogParams>
    </v-dialog>

  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {convertDate} from "../utils/mixins/date"
  import dialogEdit from "./dialog-card"
  import dialogAddNew from "./dialog-card-addNew"
  import dialogParams from "./dialog-params"

  export default {
    name: 'ware-card__list',
    mixins: [convertDate],
    components: {
      dialogEdit: dialogEdit,
      dialogAddNew: dialogAddNew,
      dialogParams: dialogParams
    },
    data () {
      return {
        autoReload: false,
        key:"",
        nameKeySelected: 'wareCardInternalNumber',
        loading: true,
        headers: [],
        data : [],
        // selectedItemsIds: [],
        // showControlElements: false,
        offsetTop:0,

        dialog_edit: false,
        dialog_addNew: false,
        dialog_params: false,

        selectedAll: false,
        selected:[],
        users_list: [],
        photographer_list: [],
        status_list: [],
        website_list: [],
        workflow_list: [],
        form: {
          user: null,
          photographer: null,
          dateBegin: null,
          dateEnd: null,
          status: null,
          website: null,
          rowsLimit: 15
        },
        dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
        dateBeginElementShow: false,
        dateEndElementShow: false,
        showFilter: true
      }
    },
    mounted () {
      this.get_header()
      this.autoReloadGo()

      this.USERS_LIST()         .then((res)=>{ this.users_list = res.data })
      this.STATUS_CARDS_LIST()  .then((res)=>{ this.status_list = res.data })
      this.WEBSITE_LIST()       .then((res)=>{this.website_list = res.data })
      this.PHOTOGRAPHER_LIST()         .then((res)=>{
        this.photographer_list = res.data
      })



      // this.$store.dispatch("GET_PERSPECTIVE_CHOSEN_PHOTOFILE_LIST").then(res=>{
      //   // console.log(res.data)
      // })



    },

    methods: {
      ...mapActions([
        "USERS_LIST",
        "STATUS_CARDS_LIST",
        "WEBSITE_LIST",
        "PHOTOGRAPHER_LIST"
      ]),

      ...mapActions( "retouch" , {
        downloadRetouch: "download"
      }),

      autoReloadGo: function(){
        setTimeout(()=>{
          if (this.autoReload){
            this.get_body()
          }
          this.autoReloadGo()
        },30000)

      },

      onScroll (e) {
        this.offsetTop = this.offsetTop = e.target.scrollTop
      },

      //  получение списка ид для шапки
      get_header: function(){
        this.$store.dispatch( "wareCard/getHeader_" )
          .then( (res) => {
            this.key = res.key
            this.headers = this.prepare_header(res.headers, res.key)
            this.get_body()
          })
          .catch(err => {
           // console.log(err)
          })
      },

      //  подготовливаем массив header виду vuetyfy
      prepare_header: function (data, key) {
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

      // получени данных
      get_body: function(){

        this.$store.dispatch("wareCard/getBody_", this.form)
          .then( (res) => {
            res.data.map( (el) => {
              el.wareCardCreateDate = this.convertTimeToDate(el.wareCardCreateDate)
            })
            this.data = res.data
            this.loading = false

            // this.selectedItemsIds = []
            // this.showControlElements= false

          })
      },

      go2_edit: function () {
        this.dialog_edit = true
      },



      dialogEdit__close: function () {
        this.dialog_edit = false
      },


      // click очистка выбранных
      clk__selected__clear: function(){
        if (this.selectedAll){
          this.selectedAll = false
        }else{
          this.selected = []
        }
      },

      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },
      // parseDate (date) {
      //   if (!date) return null
      //   const [month, day, year] = date.split('/')
      //   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      // },

      __clearDateBegin: function () { this.form.dateBegin = null },
      __clearDateEnd: function () { this.form.dateEnd = null },

      search: function(){
        this.get_body()
      },

      clk_row: function(item){
        this.selected = [item]
        this.dialog_edit = true
      },

      setNewWareCardStatus: function(newStatusCode){
        let p = []
        this.selected.map((el)=>{
          p.push(
            new Promise((resolve) => {
              this.$store.dispatch(
                "wareCard/changeStatusCard_",
                {
                  wareCardCode: el.wareCardCode,
                  wareCardStatusCode: newStatusCode
                }
              ).then(() => {
                resolve()
              })
            })
          )
        })
        Promise.all(p).then(() => {
          this.selected = []
          this.get_body()
        });
      },

      clk_change_rowsLimit: function(rowsLimitValue){
        this.form.rowsLimit = rowsLimitValue
        this.get_body()
      },


      // Retouch
      DownloadRetouch: function(){
        let wareCardCodeList = []
        this.selected.map(el=>{ wareCardCodeList.push(el.wareCardCode) })
        this.downloadRetouch({
          "photographerUserCodeList": [this.form.photographer],
          "wareCardCodeList": wareCardCodeList
        })
      }

    },

    computed: {
      showFakeHead: function () {
        return this.offsetTop > 48
      },
      computedDateBeginFormatted () {
          return this.formatDate(this.form.dateBegin)
      },
      computedDateEndFormatted () {
        return this.formatDate(this.form.dateEnd)
      },

      // Retouch
      showDownloadRetouchButton: function(){
        // return this.form.photographer && this.selected.length > 0
        return this.selected.length > 0
      }

    },

    updated: function(){

      if (this.showFakeHead){
        let
          thead = this.$refs.thead.children,
          theadApps = this.$refs.theadApps.children
        for (let i=0; i<=thead.length-1;i++ ){
          theadApps[i].style.width = thead[i].offsetWidth + "px"
        }
      }

      this.$emit('sync-content')

    },

    watch: {

      // Нажимаем на выбрать все.
      selectedAll: function(newValue){
        if (newValue){
          this.selected = this.data.slice()
        }else{
          this.selected = []
        }

      },

      selected: function(newValue){
        if (newValue.length >= 1){
          // Проверяем одинаковые ли статусы имеют выделеные КТ
          let res = {}
          newValue.map((el)=>{
            res[el.wareCardStatusName] = el
          })
          if (Object.keys(res).length == 1){
            this.workflow_list = res[Object.keys(res)[0]].wareCardStatusWorkflowDtoList
          } else {
            this.workflow_list = []
          }
        }else{
          this.workflow_list = []
        }
      }

    }

  }

</script>

