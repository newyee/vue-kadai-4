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
    wallet: state => state.wallet,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    saveUserData (state, payload) {
      state.userName = payload.userName
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
        const uid = response.data.localId
        const wallet = 500
        // console.log(uid)
        // console.log(wallet)
        await axios.post('https://firestore.googleapis.com/v1/projects/vue-kadai-4-6e35a/databases/(default)/documents/user-data',
          {
            fields: {
              name: {
                stringValue: userData.userName
              },
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
          wallet: wallet
        }
        context.commit('saveUserData', payload)
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
          userName: userData.user,
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
