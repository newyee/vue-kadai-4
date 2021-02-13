import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: '',
    email: '',
    returnSecureToken: true
  },
  getters: {
    userName: state => state.userName,
    email: state => state.email,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    saveUserData (state, userData) {
      state.userName = userData.userName
      state.email = userData.email
    }
  },
  actions: {
  },
  modules: {
  }
})
