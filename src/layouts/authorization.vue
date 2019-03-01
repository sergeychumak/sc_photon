<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex></v-flex>
          <v-flex shrink>
            <v-card class="elevation-12" width="500">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{$t('pagesTitle.auth')}}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="username" :label="$t('labels.login')" type="text" v-model="username" ></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" :label="$t('labels.password')" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="auth_inProcess"
                  :disabled="auth_inProcess"
                  color="primary"
                  @click="login">{{$t('btns.enter')}}</v-btn>
              </v-card-actions>
              <v-alert :value="error" type="error">{{errorText}}</v-alert>
            </v-card>
          </v-flex>
          <v-flex></v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'layout-authorization',
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions( 'auth', {
      auth_login: 'login'
    }),
    login: function () {
      const { username, password } = this
      this
        .auth_login({ username, password })
        .then(()=>{this.$router.push({name:'main'})})
        .catch(()=>{this.$router.push({name:'auth'})})
    }
  },
  computed: {
    ...mapGetters('auth' , {
      auth_inProcess: 'inProcess',
      error: 'error',
      errorText: 'errorText'
    })
  }
}
</script>
