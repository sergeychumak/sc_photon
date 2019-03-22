<template>

  <v-app>

    <v-navigation-drawer
      :mini-variant="mini"
      permanent
      overflow
      app
      stateless
    >
      <v-toolbar flat class="transparent">

        <v-list class="pa-0">

          <v-list-tile @click="mini=!mini">
            <v-list-tile-avatar><v-icon>menu</v-icon></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="caption brown--text text--lighten-4">Скрыть панель</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar color="blue" class="pt-3" style="height: 85px; background: #f1f8ff">
            <v-list-tile-avatar>
              <v-badge overlap @click="" color="blue">
                <!--<span slot="badge" >3</span>-->
                <v-avatar>
                  <v-icon large>account_box</v-icon>
                  <!--<img src="https://pp.userapi.com/c628124/v628124157/3edeb/hVAEfo3snwI.jpg?ava=1">-->
                </v-avatar>
              </v-badge>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="body-2">{{NAME}}</v-list-tile-title>
              <v-list-tile-sub-title>
                <span class="caption brown--text text--lighten-3 pr-1">{{LOGIN}}</span>
                <!--<span class="caption brown&#45;&#45;text text&#45;&#45;lighten-3">Разрабочик</span>-->
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>


          <!--this.$router.push({name: "list_v1", query: Object.assign(form)})-->

          <router-link tag="v-list-tile" :to="{ name: 'card-list' }">
            <v-list-tile-avatar>
              <v-tooltip bottom>
                <v-icon slot="activator">burst_mode</v-icon>
                <span>Список карточек</span>
              </v-tooltip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="body-1">Список карточек</v-list-tile-title>
            </v-list-tile-content>
          </router-link>

          <!--<router-link tag="v-list-tile" :to="{ name: 'settings' }">-->
            <!--<v-list-tile-avatar>-->
              <!--<v-tooltip bottom>-->
                <!--<v-icon slot="activator">settings</v-icon>-->
                <!--<span>Настройки</span>-->
              <!--</v-tooltip>-->
            <!--</v-list-tile-avatar>-->
            <!--<v-list-tile-content>-->
              <!--<v-list-tile-title class="body-1">Настройки</v-list-tile-title>-->
            <!--</v-list-tile-content>-->
          <!--</router-link>-->

          <router-link tag="v-list-tile" :to="{ name: 'uploadRetouch' }">
            <v-list-tile-avatar>
              <v-tooltip bottom>
                <v-icon slot="activator">iso</v-icon>
                <span>Загрузить ретушь</span>
              </v-tooltip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="body-1">Загрузить ретушь</v-list-tile-title>
            </v-list-tile-content>
          </router-link>

          <router-link tag="v-list-tile" :to="{ name: 'referenceBook' }">
            <v-list-tile-avatar>
              <v-tooltip bottom>
                <v-icon slot="activator">local_library</v-icon>
                <span>Справочники</span>
              </v-tooltip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="body-1">Справочники</v-list-tile-title>
            </v-list-tile-content>
          </router-link>

          <v-list-tile @click="$router.push({name:'logout'})">
            <v-list-tile-avatar>
              <v-tooltip bottom>
                <v-icon slot="activator" color="error">close</v-icon>
                <span >Выйти из системы</span>
              </v-tooltip>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="body-1 error--text">Выйти из системы</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>



        </v-list>
      </v-toolbar>

    </v-navigation-drawer>

    <v-toolbar app absolute dense class="elevation-0" color="white">
      <v-toolbar-title class="caption">{{$t('name')}}</v-toolbar-title>
      <v-toolbar-title ref="isHook__Name_main" class="caption ml-1"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div ref="isHook__Actions_main"></div>
    </v-toolbar>

    <v-content class="vhHeight">
      <v-container fluid fill-height class="ma-0 pa-0">
        <router-view ref="rView"></router-view>
        <!--<router-view v-on:sync-content="syncContentMaster"></router-view>-->

        <!-- in router used v-layout... example -->
        <!--<v-layout>
          <v-flex shrink class="overflowAuto">
            <v-navigation-drawer permanent></v-navigation-drawer>
          </v-flex>
          <v-flex class="overflowAuto"></v-flex>
        </v-layout>-->

      </v-container>
    </v-content>

    <SnackbarComponents_v1></SnackbarComponents_v1>

  </v-app>

</template>

<script>

  import SnackbarComponents from "@/components/snackbar"
  import SnackbarComponents_v1 from "@/components/v1/snackbar"
  import { UpdateEmit } from "@/utils/updateEmit"
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Layout_V1',
    mixins:[UpdateEmit],
    data: function(){
      return {
        snackbar: true,
        mini: true,
        refsSync: null
      }
    },
    mounted: function(){
      this.getCurrentAccountUser()
    },
    methods: {
      ...mapActions( "account", {
        getCurrentAccountUser: "getCurrentAccountUser"
      })
    },
    computed: {
      ...mapGetters( "account", {
        NAME: 'name',
        LOGIN: 'login'
      })
    },
    components: {
      Snackbar: SnackbarComponents,
      SnackbarComponents_v1: SnackbarComponents_v1
    }
  }
</script>
