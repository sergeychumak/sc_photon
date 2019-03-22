<template>
  <v-layout style="border-top: 1px solid #e0e0e0">

    <!-- NAME -->
    <div class="isHook">
      <div ref="isHook__Name" class="blue--text" >
        / {{$t('pagesTitle.referenceBook')}}
      </div>
    </div>

    <!-- ACTION -->
    <div class="isHook">
      <div ref="isHook__Actions"></div>
    </div>

    <v-flex shrink>
      <v-navigation-drawer permanent class="elevation-0" width="200">
        <v-list class="pa-0">
          <v-list-tile @click="$router.push({name:'referenceBookUsers'})">
            <v-list-tile-avatar><v-icon>person</v-icon></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="caption">{{$t('labels.users')}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="$router.push({name:'referenceBookRoles'})">
            <v-list-tile-avatar><v-icon>group</v-icon></v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="caption">{{$t('labels.roles')}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>
    </v-flex>

    <v-flex class="overflowAuto">
      <router-view ref="rView"></router-view>
    </v-flex>

  </v-layout>
</template>

<script>
  export default {
    name: 'page-reference-book',
    // mixins:[ UpdateEmitB ],
    data: () => ({}),
    // mounted: function(){
    //   console.log(2)
    // },
    // updated: function(){
    //   console.log(22)
    // }
  }
</script>

