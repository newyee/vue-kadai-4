import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios-auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: '',
    email: ''
  },
  getters: {
    userName: state => state.userName,
    email: state => state.email,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    saveUserData (state, payload) {
      state.userName = payload.userName
      state.email = payload.email
    }
  },
  actions: {
    registerUserData (context, userData) {
      axios.post('/accounts:signUp?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
        {
          email: userData.email,
          password: userData.email,
          returnSecureToken: true
        }
      ).then(response => {
        const payload = {
          userName: userData.userName,
          email: userData.email
        }
        context.commit('saveUserData', payload)
      })
    }
  },
  modules: {
  }
})
