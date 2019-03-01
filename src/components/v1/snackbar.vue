<template>
  <v-snackbar
    v-model="SNACKBAR_DATA.show"
    :color="SNACKBAR_DATA.color"
    :timeout="SNACKBAR_DATA.timeout"
    right
  >
    {{ SNACKBAR_DATA.text }}
    <v-btn dark flat @click="HIDE_SNACKBAR">
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
        HIDE_SNACKBAR: "hide"
      })
    }
  }
</script>
