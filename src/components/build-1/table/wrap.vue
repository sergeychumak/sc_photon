<template>
  <v-layout column fill-height >




    <!--<v-flex shrink>-->
      <!--<v-data-table-->
        <!--:headers="_headers"-->
        <!--:items="['']"-->
        <!--hide-actions-->
        <!--item-key="id"-->
      <!--&gt;-->
        <!--<template slot="headers" slot-scope="props">-->
          <!--<tr>-->
            <!--<th></th>-->
            <!--<th v-for="header in props.headers">-->
              <!--{{header}}-->
            <!--</th>-->
          <!--</tr>-->
        <!--</template>-->
      <!--</v-data-table>-->
    <!--</v-flex>-->

    <v-flex class="wrapTable">
      <v-data-table
        :headers="_headers"
        :items="body"
        hide-actions
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th v-for="item in props.headers">
              {{item.text}}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
        <tr>
          <td v-for="itemHeader in _headers">
            {{props.item[itemHeader.value]}}
          </td>
        </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'wrap-table-component',
    data: function(){
      return {
      }
    },
    props: {
      headersKey: {
        type: String,
        default : ""
      },
      headers: {
        type: Array,
        default : () => {
          return []
        }
      },
      body: {
        type: Array,
        default : () => {
          return []
        }
      }
    },
    computed: {
      _headers: function(){
        var res = []
        this.headers.map(el=>{
          res.push({
            text: this.$t('TABLE.' + this.headersKey + '.' + el),
            value: el,
            align: 'left',
            sortable: false,
            class: '',
            width: ''
          })
        })
        return res
      },
      bodyEmpty: function(){
        return this.body.length > 0
      }
    }
  }
</script>

<style>
  .wrapTable{
    position: relative;
  }
  .v-table__overflow {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    overflow-x: auto!important;
    overflow-y: auto!important;
  }
</style>

