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
      ).then(async response => {
        console.log(response)
        await axios.post('/accounts:update?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
          {
            idToken: response.data.idToken,
            displayName: userData.userName,
            returnSecureToken: true
          }
        ).then(async response => {
          const uid = response.data.localId
          await axios.post('https://firestore.googleapis.com/v1/projects/vue-kadai-4-6e35a/databases/(default)/documents/cities/user-data',
            {
              fields: {
                uid: {
                  name: {
                    stringValue: userData.userName
                  },
                  wallet: {
                    integerValue: 500
                  }
                }
              }
            }
          ).then(response => {
            console.log('hogehoge', response)
          })
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
