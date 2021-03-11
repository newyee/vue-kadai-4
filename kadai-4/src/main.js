import firebase from "firebase";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk",
  authDomain: "vue-kadai-4-6e35a.firebaseapp.com",
  projectId: "vue-kadai-4-6e35a",
  storageBucket: "vue-kadai-4-6e35a.appspot.com",
  messagingSenderId: "921267101967",
  appId: "1:921267101967:web:739b9992ed396f56665e7a",
  measurementId: "G-KG2MPX74TE"
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
