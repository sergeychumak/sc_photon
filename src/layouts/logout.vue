<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'layout-logout',
  mounted: function(){
    this.logout().then(()=>{
      this.$router.push({name: 'main'})
    })
  },
  methods: {
    ...mapActions( 'auth', {
      logout: 'logout'
    })
  }
}
</script>
