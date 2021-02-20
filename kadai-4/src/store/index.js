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
    async registerUserData (context, userData) {
      await axios.post('/accounts:signUp?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
        {
          email: userData.email,
          password: userData.password,
          returnSecureToken: true
        }
      ).then(response => {
        // console.log('response', response)
        axios.post('/accounts:update?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
          {
            idToken: response.data.idToken,
            displayName: userData.userName,
            returnSecureToken: true
          }
        ).then(response => {
          console.log('response', response)
          const payload = {
            userName: userData.userName,
            email: userData.email
          }
          context.commit('saveUserData', payload)
        }).catch(error => {
          console.log('error', error)
        })
      }).catch(error => {
        console.log('error', error)
      })
    },
    async login (context, userData) {
      await axios.post('/accounts:signInWithPassword?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
        {
          email: userData.email,
          password: userData.password,
          returnSecureToken: true
        }
      ).then(response => {
        const payload = {
          userName: response.data.displayName,
          email: response.data.email
        }
        context.commit('saveUserData', payload)
      }).catch(error => {
        console.log('error', error)
      })
    }
  },
  modules: {
  }
})
