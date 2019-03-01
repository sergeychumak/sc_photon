<template>
  <div class="pa-4">
    <v-text-field :label="$t('TABLE.' + key + '.email')"></v-text-field>
    <v-text-field :label="$t('TABLE.' + key + '.firstName')"></v-text-field>
    <v-text-field :label="$t('TABLE.' + key + '.lastName')"></v-text-field>
    <v-text-field :label="$t('TABLE.' + key + '.patronymic')"></v-text-field>
    <v-text-field :label="$t('TABLE.' + key + '.login')"></v-text-field>
    <v-text-field :label="$t('TABLE.' + key + '.password')"></v-text-field>
    <v-btn @click="$emit('create')">!</v-btn>
  </div>
</template>

<script>
  export default {
    name: 'users-add',
    data: function(){
      return {
        key: "ACCOUNT"
      }
    }
  }
</script>

