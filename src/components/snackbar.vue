<template>
  <v-snackbar
    v-model="SNACKBAR_DATA.show"
    :color="SNACKBAR_DATA.color"
    :timeout="SNACKBAR_DATA.timeout"
    right
  >
    {{ SNACKBAR_DATA.text }}
    <v-btn dark flat @click="close">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'SnackbarComponents',
    computed: {
      ...mapGetters( "snackbar", {
        SNACKBAR_DATA: "data"
      })
    },
    methods: {
      ...mapActions( "snackbar", {
        SNACKBAR_CLOSE: "close"
      }),
      close: function(){
        this.SNACKBAR_CLOSE()
      }
    }
  }
</script>
