import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
  state: {
    userName: '',
    wallet: '',
    userUid: '',
    userList: []
  },
  getters: {
    userName: state => state.userName,
    wallet: state => state.wallet,
    userUid: state => state.userUid,
    returnSecureToken: state => state.returnSecureToken,
    userList: state => state.userList
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
    setUserList(state,payload){
      state.userList = payload
    },
    changeLoginUserWallet(state,wallet){
      state.wallet -= wallet
    }
  },
  actions: {
    async throwWallet(context,payload){
      const db = firebase.firestore()
      const dbUserData = db.collection('user-data').doc(context.getters.userUid)
      const sendDbUserData = db.collection('user-data').doc(payload.sendUserUid)
      const wallet= parseInt(payload.wallet)
      let sendUserWallet = parseInt(payload.sendUserWallet)
      context.commit('changeLoginUserWallet',wallet)
      sendUserWallet = sendUserWallet + wallet
      await db.runTransaction((transaction) => {
        transaction.update(
          dbUserData,
          {wallet: context.getters.wallet},
        )
        transaction.update(
          sendDbUserData,
          {wallet: sendUserWallet},
        )
      }).then(() => {
        console.log('successfully committed!')
      }).catch((error) => {
        console.log('Transaction failed: ', error)
      })

      await db.collection('user-data')
      .where('userName', '!=', context.getters.userName)
      .get()
      .then((querySnapshot) => {
        const userData = []
        querySnapshot.forEach((doc) => {
          userData.push(doc.data())
        })
        context.commit('setUserList', userData)
      })
    },
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
              wallet,
              uid,
            })
            .then(_ => {
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
