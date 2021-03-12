import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
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
    saveUserData(state, payload) {
      state.userName = payload.userName
      state.wallet = payload.wallet
    }
  },
  actions: {
    async registerUserData(context, userData) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then(async response => {
          console.log(response)
          const db = firebase.firestore()
          const uid = response.user.uid
          const wallet = 500
          const userName = userData.userName
          await db
            .collection('user-data')
            .add({
              uid: uid,
              userName: userName,
              wallet: wallet
            })
            .then(docRef => {
              console.log('Document written with ID: ', docRef.id)
              const payload = {
                userName: userData.userName,
                wallet: wallet
              }
              context.commit('saveUserData', payload)
            })
            .catch(error => {
              console.error('Error adding document: ', error)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    async login(context, userData) {
      await firebase
        .auth()
        .signInWithEmailAndPassword(userData.email, userData.password)
        .then(response => {
          const payload = {
            userName: userData.user,
            email: userData.email
          }
          context.commit('saveUserData', payload)
          console.log(response)
        })
        .catch(error => {
          console.log(error)
          // var errorCode = error.code
          // var errorMessage = error.message
        })
      // await axios
      //   .post(
      //     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
      //     {
      //       email: userData.email,
      //       password: userData.password,
      //       returnSecureToken: true
      //     }
      //   )
      //   .then(response => {
      //     const payload = {
      //       userName: userData.user,
      //       email: response.data.email
      //     }
      //     context.commit('saveUserData', payload)
      //   })
      //   .catch(error => {
      //     console.log('error', error)
      //   })
    }
  },
  modules: {}
})
