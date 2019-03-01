<template>

  <div style="width: 100%; height:100%; padding: 40px;">
    <div style="width:500px; margin:0 auto">


      <v-toolbar color="darken-3" app fixed1 dense>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Добавление новой карточки</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <h3 class="mb-2 mt-3">Тип создания</h3>
      <v-select
        v-model="form.type"
        :items="listTypeRequest"
        solo
        item-text="label"
        item-value="id"
        hide-details
      ></v-select>

      <h3 class="mb-2 mt-3">Сайт</h3>
      <v-select
        v-model="form.site"
        :items="listWebSite"
        solo
        item-text="name"
        item-value="name"
        hide-details
      ></v-select>

      <h3 class="mb-2 mt-3" v-if="form.type!=='guid'">Значение</h3>
      <v-text-field solo v-model="form.value" hide-details v-if="form.type!=='guid'"></v-text-field>

      <v-btn color="primary" class="mt-3" @click="createCard">Создать</v-btn>
      <v-btn class="mt-3" @click="$emit('close-dialog')">Отмена</v-btn>

      <v-alert
        :value="error"
        type="error"
      >
        Цветовая модель не найдена
      </v-alert>

    </div>

  </div>

</template>

<script>
  export default {
    name: 'DialogCardAddNew',
    props: ["dialog_addNew"],
    data: () => ({
      form: {
        type: null,
        site: null,
        value: null
      },
      listTypeRequest: [
        {id:"article",label:"По артиклу"},
        {id:"code",label:"По шрих коду"},
        {id:"colormodel",label:"По цветомодели"},
        {id:"guid",label:"По guid"}
      ],
      listWebSite: [],
      error: false
    }),
    mounted: function(){
      this.fillWebSite()
    },
    watch: {
      dialog_addNew: function (newValue) {
        if (newValue) {
          this.fillWebSite()
        }
      }
    },
    methods: {
      fillWebSite: function(){
        this.$store.dispatch( "wareCard/getWebSite_" )
        .then( (res) => {
          this.listWebSite = res
          if (res.length === 1) {
            this.form.site = res[0].webSiteName
          }
        })
      },
      createCard: function(){
        this.$store.dispatch( "wareCard/createCard_" , Object.assign(this.form, { ignoreMdmValidation: this.ignoreMdmValidation }))
        .then( (res) => {
          if (res){
            this.error = false
            this.$emit('close-dialog')
          }
        } )
        .catch(()=>{
          this.error = true
        })
      }
    },
    computed: {
      ignoreMdmValidation: function(){
        return this.form.type === "code"
      }
    }
  }


</script>


