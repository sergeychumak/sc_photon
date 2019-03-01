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

        <v-menu transition="slide-x-transition" left v-if="list.workflow.length > 0">
          <v-btn slot="activator" icon flat color="orange darken-4"><v-icon color="orange darken-4">menu</v-icon></v-btn>
          <v-list dense>
            <v-list-tile v-for="item in list.workflow" :key="item.nextWareCardStatusCode" @click="setNewWareCardStatus(item.nextWareCardStatusCode)">
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
        <v-tooltip bottom >
          <v-btn
            v-if="autoReload"
            @click="_autoReloadToggle(false)"
            color="blue"
            slot="activator"
            icon flat>
            <v-badge color="white">
              <span slot="badge" class="caption brown--text text--lighten-4">{{autoReloadSec}}</span>
              <v-icon color="blue">sync</v-icon>
            </v-badge>
          </v-btn>
          <v-btn
            v-else
            @click="_autoReloadToggle(true)"
            color="blue"
            slot="activator"
            icon flat>
            <v-icon color="blue">sync_disabled</v-icon>
          </v-btn>
          <span v-if="autoReload">Выключить автообновление</span>
          <span v-else>Включить автообновление</span>
        </v-tooltip>

        <!--PERPAGE-->
        <v-menu transition="slide-x-transition" left>
          <v-btn slot="activator" icon flat color="blue">{{form.rowsLimit}}</v-btn>
          <v-list dense>
            <v-list-tile v-for="(item,index) in [15,30,50,100,300]" :key="index" @click="form.rowsLimit = item">
              <v-list-tile-title>{{item}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>

      <v-card v-if="flags.showFilter" class="elevation-0 pt-1" style="height: 85px; background: #f1f8ff">
        <v-card-text class="pa-0 ma-0 pl-3 pr-3">

          <v-layout row wrap >
            <v-flex xs2 class="pa-1">
              <div class="caption blue-grey--text">Создал</div>
              <v-autocomplete
                v-model="form.creatorUserCode"
                solo
                dense
                class="mb-1"
                item-value="accountUserCode"
                hide-details
                clearable
                :items="list.creatorUserCode"
              >
                <template slot="item" slot-scope="props">
                  <template v-if="props.item">
                    {{props.item.lastName}} {{props.item.firstName}}
                  </template>
                </template>
                <template slot="selection" slot-scope="props" >
                  <template v-if="props.item">
                    {{props.item.lastName}}
                  </template>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs2 class="pa-1">
              <div class="caption blue-grey--text">Фотограф</div>
              <v-autocomplete
                v-model="form.photographerUserCode"
                solo
                dense
                class="mb-1"
                item-value="accountUserCode"
                hide-details
                clearable
                :items="list.photographerUserCode"
              >
                <template slot="item" slot-scope="props">
                  <template v-if="props.item">
                    {{props.item.lastName}} {{props.item.firstName}}
                  </template>
                </template>
                <template slot="selection" slot-scope="props" >
                  <template v-if="props.item">
                    {{props.item.lastName}}
                  </template>
                </template>
              </v-autocomplete>
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
                  @click:clear="form.wareCardCreateDateFrom = null"
                ></v-text-field>
                <v-date-picker v-model="form.wareCardCreateDateFrom" no-title @input="dateBeginElementShow = false"></v-date-picker>
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
                  @click:clear="form.wareCardCreateDateTo = null"
                ></v-text-field>
                <v-date-picker v-model="form.wareCardCreateDateTo" no-title @input="dateEndElementShow = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs2 class="pa-1">
              <div class="caption blue-grey--text">Статус</div>
              <v-select
                v-model="form.wareCardStatusCode"
                :items="list.wareCardStatusCode"
                item-text="name"
                item-value="code"
                solo
                hide-details
                clearable
              >
                <template slot="item" slot-scope="props">
                  <template v-if="props.item && props.item.name">
                    {{$t('STATUS.KT.' + props.item.name)}}
                  </template>
                </template>
                <template slot="selection" slot-scope="props" >
                  <template v-if="props.item && props.item.name" >
                    {{$t('STATUS.KT.' + props.item.name)}}
                  </template>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs2 class="pa-1">
              <div class="caption blue-grey--text">Сайт</div>
              <v-autocomplete
                v-model="form.gateSitesGroupCode"
                solo
                dense
                class="mb-1"
                item-text="name"
                item-value="gateSitesGroupCode"
                hide-details
                clearable
                :items="list.gateSitesGroupCode"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

        </v-card-text>
      </v-card>

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
              v-scroll:#scroll-target="onScroll"
            >
              <h3 class="pt-3" v-if="data.length === 0">Нет данных</h3>
              <!--FAKE HEAD-->
              <transition name="fade" v-else>
                <div
                  class="isTable__fakeHeads elevation-15"
                  v-if="showFakeHead"
                  :style="{top: offsetTop + 'px'}"
                  ref="theadApps"
                >
                  <div style="width: 40px;" class="pa-0 ma-0 pl-2"></div>
                  <div style="width: 40px;"></div>
                  <div v-for="itemHeader in headers">
                    <span class="caption" style="white-space:nowrap;">{{ itemHeader.text }}</span>
                  </div>
                </div>
              </transition>
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

  export default {
    name: 'card-list',
    mixins: [convertDate],
    data: function(){
      return {

        loading: true,

        autoReload: false,
        autoReloadSec: 30,
        autoReloadSec_default: 30,

        headers: [],
        data: [],

        form: {
          creatorUserCode: null,
          photographerUserCode: null,
          wareCardCreateDateFrom: null,
          wareCardCreateDateTo: null,
          wareCardStatusCode: null,
          gateSitesGroupCode: null,
          rowsLimit: 15
        },
        flags: {
          showFilter: true,
          enabledWatch: true
        },

        list: {
          creatorUserCode: null,
          photographerUserCode: null,
          wareCardStatusCode: null,
          gateSitesGroupCode: null,
          workflow: []
        },

        dateBeginElementShow: false,
        dateEndElementShow: false,

        offsetTop:0,
        selected:[],
        selectedAll: false

      }
    },
    methods: {

      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest",
        ERROR_HANDLER: "errorHandler"
      }),

      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },

      getHeader: function(){
        this.loading = true
        this.GET_REQUEST({url:"wareCard.tableHeader"})
        .then((res) => {
          // this.key = res.key
          this.headers = this.prepareHeader(res.headers, res.key)
          this.getData()
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

      getData: function(){
        this.loading = true

        var tmpForm = Object.assign({}, this.form, {
          wareCardCreateDateFrom: this.form.wareCardCreateDateFrom ? new Date(this.form.wareCardCreateDateFrom).getTime() : null,
          wareCardCreateDateTo: this.form.wareCardCreateDateTo ? new Date(this.form.wareCardCreateDateTo + ' 23:59:59').getTime() : null
        })

        var form = this._routerPush(tmpForm)

        this.POST_REQUEST({
          url: "wareCard.tableBody",
          data: form
        }).then(res=>{

            this.autoReloadSec = this.autoReloadSec_default
            this.$set(this.flags, 'enabledWatch', true)

            res.data.map( (el) => {
              el.wareCardStatusName = this.$t('STATUS.KT.' + el.wareCardStatusName)
              el.wareCardCreateDate = this.convertTimeToDate(el.wareCardCreateDate)
            })
            this.data = res.data
            setTimeout(()=>this.loading = false,1000)
        })

      },

      onScroll (e) { this.offsetTop = e.target.scrollTop },

      autoReloadGo: function(){
        setTimeout(()=>{
          if (this.autoReload){
            var s = this.autoReloadSec - 1
            if (s < 0){
              s = this.autoReloadSec_default
              this.getData()
            }
            this.autoReloadSec = s
            this.autoReloadGo()
          }
        },1000)

      },

      setNewWareCardStatus: function(newStatusCode){
        let p = []
        this.selected.map((el)=>{
          p.push(
            new Promise((resolve) => {
              this.POST_REQUEST({
                url: "wareCard.setStatus",
                data: {
                  wareCardCode: el.wareCardCode,
                  wareCardStatusCode: newStatusCode
                }
              })
                .then(()=>resolve())
            })
          )
        })
        Promise.all(p).then(() => {
          this.selected = []
          this.getData()
        });
      },

      downloadRetouch: function(){

        //Убрал 20,02,2018 сказал Костя
        // Фотограф должен быть выбран
        // if (!this.form.photographerUserCode){
        //   this.ERROR_HANDLER({
        //     data : {
        //       "messageCodeReturn": "UserException",
        //       "messageReturn": "no_photographer_selected"
        //     }
        //   })
        // }
        
        var
          wareCardCodeList = [],
          photographerList = [],
          addParamStringPhotographerUserCodeList = "photographerUserCodeList=",
          addParamStringWareCardCodeList = "wareCardCodeList="

        if (this.form.photographerUserCode)
          photographerList.push(this.form.photographerUserCode)

        this.selected.map(el=>{ wareCardCodeList.push(el.wareCardCode) })

        addParamStringPhotographerUserCodeList =
          addParamStringPhotographerUserCodeList + photographerList.join("&photographerUserCodeList=")

        addParamStringWareCardCodeList =
          addParamStringWareCardCodeList + wareCardCodeList.join("&wareCardCodeList=")

        this.POST_REQUEST({
          url: "zipFile.retouch.validate",
          data: {
            photographerUserCodeList: photographerList,
            wareCardCodeList: wareCardCodeList
          }
        })
        .then(()=>{
          this.selected = []
          window.open(
            this.getUrl('zipFile.retouch.get')+
            '?' + addParamStringPhotographerUserCodeList +
            '&' + addParamStringWareCardCodeList
            , '_blank');
        })

      },

      _getData: function(){
        if (this.flags.enabledWatch){
          this.loading = true;
          this.selected = [];
          this.getData()
        }
      },

      _autoReloadToggle: function(f){
        if (f){
          this.autoReload = true;
          this.autoReloadSec = this.autoReloadSec_default;
          this.autoReloadGo()
        }else{
          this.autoReload = false
        }
        this._routerPush(this.form)
      },

      _routerPush: function(tmpForm){
        var form = {}
        Object.keys(tmpForm).filter(el=>{
          if (tmpForm[el]){
            form[el] = tmpForm[el]
          }
        })
        this.$router.push({
          name: "card-list",
          query: Object.assign(form, {
            autoReload: this.autoReload ? 1 : 0
          })
        })
        return form
      }

    },
    watch: {
      "form.creatorUserCode": function(){         this._getData() },
      "form.photographerUserCode": function(){    this._getData() },
      "form.wareCardCreateDateFrom": function(){  this._getData() },
      "form.wareCardCreateDateTo": function(){    this._getData() },
      "form.wareCardStatusCode": function(){      this._getData() },
      "form.gateSitesGroupCode": function(){      this._getData() },
      "form.rowsLimit": function(){               this._getData() },
      "selected": function(newValue){

       console.log(newValue)

        if (newValue.length >= 1){
          // Проверяем одинаковые ли статусы имеют выделеные КТ
          let res = {}
          newValue.map((el)=>{
            res[el.wareCardStatusName] = el
          })
          if (Object.keys(res).length == 1){
            this.list.workflow = res[Object.keys(res)[0]].wareCardStatusWorkflowDtoList
          } else {
            this.list.workflow = []
          }
        }else{
          this.list.workflow = []
        }
      },
      "selectedAll": function(newValue){
        if (newValue){
          this.selected = this.data
          // console.log( this.data)
        }else{
          this.selected = []
        }
      }
    },
    mounted () {

      Promise.all([
        this.GET_REQUEST({url:"account.list"}).then((res) => { this.$set(this.list, 'creatorUserCode', res.data) }),
        this.GET_REQUEST({url:"photographer.list"}).then((res) => { this.$set(this.list, 'photographerUserCode', res.data) }),
        this.GET_REQUEST({url:"wareCard.status"}).then((res) => { this.$set(this.list, 'wareCardStatusCode', res.data) }),
        this.GET_REQUEST({url:"gateSitesGroup.list"}).then((res) => { this.$set(this.list, 'gateSitesGroupCode', res.data) })
      ]).then(()=>{

        this.$set(this.flags, 'enabledWatch', false)

        //Презаполнение формы.
        //Только теми параметрами которые нужны.
        //Все остальные игнорируем
        var form = Object.assign({},this.form)
        var keysForm = Object.keys(form)
        var keysRouter = Object.keys(this.$route.query)
        keysRouter.map(el=>{
          if (keysForm.indexOf(el) !== -1){
            form[el] = parseInt(this.$route.query[el])
          }else{
            this[el] = (this.$route.query[el] === '1')
          }
        })

        this.form = form
        this.getHeader()
        this.autoReloadGo()

      })
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
    destroyed: function(){
      this.autoReload = false
    },
    computed: {
      ...mapGetters( "api", {
        getUrl: "getUrl"
      }),
      computedDateBeginFormatted () { return this.formatDate(this.form.wareCardCreateDateFrom) },
      computedDateEndFormatted () { return this.formatDate(this.form.wareCardCreateDateTo) },
      showFakeHead: function () { return this.offsetTop > 48 }
    }
  }

</script>

