import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: '',
    email: '',
    wallet: ''
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
      state.wallet = payload.wallet
    }
  },
  actions: {
    async registerUserData (context, userData) {
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
        {
          email: userData.email,
          password: userData.password,
          returnSecureToken: true
        }
      ).then(async response => {
        await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
          {
            idToken: response.data.idToken,
            displayName: userData.userName,
            returnSecureToken: true
          }
        ).then(async response => {
          console.log('aaa', response)

          const uid = response.data.localId
          const wallet = 500
          await axios.post('https://firestore.googleapis.com/v1/projects/vue-kadai-4-6e35a/databases/(default)/documents/user-data',
            {
              fields: {
                wallet: {
                  integerValue: wallet
                },
                userId: {
                  stringValue: uid
                }
              }
            }
          ).then(response => {
            console.log('hogehoge', response)
          })
          const payload = {
            userName: userData.userName,
            email: userData.email,
            wallet: wallet
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
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
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
