import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
  state: {
    userName: '',
    wallet: '',
    userUid:'',
  },
  getters: {
    userName: state => state.userName,
    wallet: state => state.wallet,
    userUid: state => state.userUid,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    setUserUid(state, userUid) { // user_uidの取得
      state.userUid = userUid
    },
    saveUserData(state, payload) {
      state.userName = payload.userName
      state.wallet = payload.wallet
    },
    deleteUserData(state){
      state.userName = ''
      state.wallet = ''
    },
    throwWallet(state,payload){
      state.wallet -= payload.wallet
      const db = firebase.firestore()
      db.collection('user-data').doc(state.userUid).update({
        wallet:state.wallet
      })
      db.collection('user-data').doc(state.userUid).update({
        wallet:state.wallet
      })

    }
  },
  actions: {
    async registerUserData(context, userData) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then(async response => {
          const db = firebase.firestore()
          const uid = response.user.uid
          const wallet = 500
          const userName = userData.userName
          await db
            .collection('user-data')
            .doc(uid)
            .set({
              userName,
              wallet
            })
            .then(docRef => {
              const payload = {
                userName: userData.userName,
                wallet
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
        .then(async response => {
          const db = firebase.firestore()
          await db
            .collection('user-data')
            .doc(response.user.uid)
            .get()
            .then(doc => {
              const userName = doc.data().userName
              const wallet = doc.data().wallet
              const payload = {
                userName,
                wallet,
              }
              context.commit('saveUserData', payload)

            })
            .catch(error => {
              console.log('エラー',error)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    async logout({ commit }){
      await firebase.auth().signOut().then(() => {
      // Sign-out successful.
        commit('deleteUserData')
      }).catch((error) => {
        // An error happened.
        console.log('エラー', error)
      })
    },
  },
  modules: {}
})
