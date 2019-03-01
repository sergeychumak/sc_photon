import Vue from 'vue'
import VueI18n from 'vue-i18n'

// import en from './data/en.json'
import ru from './data/ru.json'

Vue.use(VueI18n)

const locale = 'ru'

// const messages = {en,ru}
const messages = {ru}

const  i18n  =  new  VueI18n ({
  // silentTranslationWarn: true,
  locale: 'ru',
  messages: messages
})

export default i18n
