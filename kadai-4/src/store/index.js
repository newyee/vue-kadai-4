import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: '',
    email: ''
  },
  getters: {
    userName: state => state.userName,
    email: state => state.email
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
