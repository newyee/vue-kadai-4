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
    loggedIn: false,
  },
  getters: {
    userName: state => state.userName,
    wallet: state => state.wallet,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    loginStatusChange(state, status) { // 認証状態を双方向に変化
      console.log('status', status)
      state.loggedIn = status
    },
    setUserUid(state, userUid) { // user_uidの取得
      state.userUid = userUid
    },
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
            .doc(uid)
            .set({
              userName: userName,
              wallet: wallet
            })
            .then(docRef => {
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
        .then(async response => {
          console.log(response)
          const db = firebase.firestore()
          await db
            .collection('user-data')
            .doc(response.user.uid)
            .get()
            .then(doc => {
              console.log('data', doc.data())
              const userName = doc.data().userName
              const wallet = doc.data().wallet
              const payload = {
                userName: userName,
                wallet: wallet
              }
              context.commit('saveUserData', payload)
            })
            .catch(error => {
              console.log('エラー',error)
            })
        })
        .catch(error => {
          console.log(error)
          // var errorCode = error.code
          // var errorMessage = error.message
        })
    },
    // 認証状態の取得をするaction
    onAuth({ commit }) {
      firebase.auth().onAuthStateChanged( async user => {
        user = user ? user : {}
        commit('setUserUid', user.uid)
        console.log('user.uid',user.uid)
        let loginFlag = false
        const db = firebase.firestore()
        if (user.uid){
          loginFlag = true
          await db
          .collection('user-data')
          .doc(user.uid)
          .get()
          .then(doc => {
            console.log('data', doc.data())
            const userName = doc.data().userName
            const wallet = doc.data().wallet
            console.log(userName)
            console.log(wallet)
            const payload = {
              userName: userName,
              wallet: wallet
            }
            commit('saveUserData', payload)
          })
          .catch(error => {
            console.log('エラー',error)
          })
        }else{
          loginFlag = false
        }
        commit('loginStatusChange', loginFlag)
      })
    },
  },
  modules: {}

})
