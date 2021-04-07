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
    loggedIn: state => state.loggedIn,
    returnSecureToken: state => state.returnSecureToken
  },
  mutations: {
    loginStatusChange(state, status) { // 認証状態を双方向に変化
      state.loggedIn = status
    },
    setUserUid(state, userUid) { // user_uidの取得
      state.userUid = userUid
    },
    saveUserData(state, payload) {
      state.userName = payload.userName
      state.wallet = payload.wallet
      console.log(payload)
      state.loggedIn = payload.loggedIn

    },
    deleteUserData(state){
      state.userName = ''
      state.wallet = ''
      state.loggedIn = false
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
                wallet: wallet,
                loggedIn:true
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
                userName: userName,
                wallet: wallet,
                loggedIn:true
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
    async logout({ commit }){
      await firebase.auth().signOut().then(() => {
      // Sign-out successful.
        commit('deleteUserData')

      }).catch((error) => {
        // An error happened.
        console.log(error)
      })
    },
    // 認証状態の取得をするaction
    async onAuth({ commit }) {
      function authUser() {
        return new Promise((resolve, reject) => {
          firebase.auth().onAuthStateChanged( async user => {
            console.log('ログイン状態の取得')
            user = user ? user : {}
            let loginFlag = false
            const db = firebase.firestore()
            console.log('データベース情報取得')
            if (user.uid){
              commit('setUserUid', user.uid)
              console.log('ユーザーIDの保存')
              loginFlag = true
              await db
              .collection('user-data')
              .doc(user.uid)
              .get()
              .then(doc => {
                const userName = doc.data().userName
                const wallet = doc.data().wallet
                const payload = {
                  userName: userName,
                  wallet: wallet,
                  loggedIn:true
                }
                commit('saveUserData', payload)
                console.log('ユーザー情報保存')
              })
              .catch(error => {
                console.log('エラー',error)
              })
            }else{
              loginFlag = false
            }
            commit('loginStatusChange', loginFlag)
            console.log('ログインフラグ保存')
          })
        });
      }
      await authUser()
    },
  },
  modules: {}

})
