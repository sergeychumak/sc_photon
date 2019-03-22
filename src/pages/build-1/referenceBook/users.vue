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
      <TableTestComponent
        :headers="headers"
        :data="data"
        :canBeEdit=true
        v-on:detected-change="detectedChange"
      ></TableTestComponent>
    </v-flex>
  </v-layout>
</template>

<script>
  import {mapActions} from 'vuex'
  import TableTestComponent from "@/components/table/table"
  export default {
    name: 'page-reference-book-user',
    components: {
      TableTestComponent: TableTestComponent
    },
    data: function(){
      return {
        headers: [
          {
            key: "accountUserCode",
            label: this.$t("TABLE_KEY.USERS.accountUserCode"),
            type: "String",
            width: '50px',
            disableEdit: true
          },
          {
            key: "login",
            label: this.$t("TABLE_KEY.USERS.login"),
            type: "String",
            disableEdit: true
          },
          {
            key: "email",
            label: this.$t("TABLE_KEY.USERS.email"),
            type: "Email",
          },
          {
            key: "lastName",
            label: this.$t("TABLE_KEY.USERS.lastName"),
            type: "String"
          },
          {
            key: "firstName",
            label: this.$t("TABLE_KEY.USERS.firstName"),
            type: "String"
          },
          {
            key: "patronymic",
            label: this.$t("TABLE_KEY.USERS.patronymic"),
            type: "String"
          },
          {
            key: "accountRoleDtoList",
            label: this.$t("TABLE_KEY.USERS.accountRoleDtoList"),
            type: "ArrayObjects",
            payload: {
              url: "accountRoleController/getRoleList",
              text: "accountRoleName",
              value: "accountRoleCode"
            }
          },
          {
            key: "isLocked",
            label: this.$t("TABLE_KEY.USERS.isLocked"),
            type: "BooleanRevert",
            width: '50px'
          },

        ],
        data: []
      }
    },

    methods: {
      ...mapActions("accountController", {
        getAccountUserList: "getAccountUserList",
        updateAccount: "updateAccount"
      }),

      detectedChange: function (payload) {
        console.log(payload)
        // this.updateAccount(payload)

      }
    },

    mounted: function(){
      this.getAccountUserList().then(res => {
        this.data = res
      })
    }

  }
</script>
