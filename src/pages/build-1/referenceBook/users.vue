<template>
  <v-layout fill-height>



    <!-- NAME -->
    <v-flex class="isHook">
      <div ref="isHook__Name" class="blue--text">
        / {{$t('pagesTitle.referenceBook')}} / {{$t('pagesTitle.referenceBookUsers')}}
      </div>
    </v-flex>

    <!-- ACTION -->
    <v-flex class="isHook">
      <div ref="isHook__Actions">
        <v-btn flat small color="primary">{{$t('BTN.CREATE')}}</v-btn>
      </div>
    </v-flex>

    <v-flex>

      <Table
        :headersKey="tableKey"
        :headers="tableHeaders"
        :body="tableBody"
      ></Table>


    </v-flex>

    <v-dialog fullscreen v-model="dialog.addNew" width="500">
      <v-card>
        <FromAddNewUser
          v-on:create="createUser"
        ></FromAddNewUser>
      </v-card>
    </v-dialog>


  </v-layout>
</template>

<script>
  import {mapActions} from 'vuex'

  import TableComponent from "@/components/build-1/table/wrap"

  import FromAddNewUser from "./users/form/add"

  export default {
    name: 'page-reference-book-user',
    components: {
      Table: TableComponent,
      FromAddNewUser: FromAddNewUser
    },
    data: function(){
      return {
        tableKey: "",
        tableHeaders: [],
        tableBody: [],

        dialog: {
          addNew: false
        }

      }
    },

    methods: {
      ...mapActions("main", {
        GET_REQUEST: "getRequest"
      }),

      createUser: function () {
        console.log('createUser')
      }
      
    },

    mounted: function(){
      this.GET_REQUEST({url: "account.tableHeader"})
      .then(res=>{
        this.tableKey = res.key
        this.tableHeaders = res.headers
      })
      this.GET_REQUEST({url: "account.tableBody"})
      .then(res=>{
        this.tableBody = res.data
      })
    }


  }
</script>

<style lang="scss" scoped1>

  .posabs {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .isTableComponent {
    @extend .posabs;
    background: #fff;
    &Wrap {
      @extend .posabs;
      & > div.v-table__overflow {
        overflow: auto;
        @extend .posabs;
      }
    }
  }


</style>
