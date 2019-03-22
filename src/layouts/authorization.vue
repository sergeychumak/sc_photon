<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex shrink>
            <v-card class="elevation-0" width="500" color="transparent">
              <v-toolbar color="transparent" class="elevation-0">
                <v-toolbar-title>{{$t('pagesTitle.auth')}}</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pb-0">
                <v-form>
                  <v-text-field
                    v-model="username"
                    :label="$t('labels.login')"
                    class="mb-3"
                    prepend-icon="person"
                    name="username"
                    type="text"
                    solo
                    hide-details
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :label="$t('labels.password')"
                    class="mb-3"
                    prepend-icon="lock"
                    name="password"
                    type="password"
                    id="password"
                    solo
                    hide-details
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="primary"
                  class="mr-2"
                  @click="login">{{$t('btns.enter')}}</v-btn>
              </v-card-actions>
              <v-alert :value="error_detect" type="error">{{error_message}}</v-alert>
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
        .then(()=>{
          this.$router.push({name:'main'})
        })
        .catch(()=>{
          this.$router.push({name:'auth'})
        })
    }
  },
  computed: {
    ...mapGetters('auth' , {
      loading: 'loading',
      error_detect: 'error_detect',
      error_message: 'error_message',
    })
  }
}
</script>
