import firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebaseConfig from './config/firebase.config'
Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Initialized!') // 確認用のメッセージ
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
