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
      console.log('wallet',wallet)
      state.wallet -= wallet
    }
  },
  actions: {
    throwWallet(context,payload){
      console.log('context.getters.wallet',context.getters.wallet)
      const db = firebase.firestore()
      const dbUserData = db.collection('user-data').doc(context.getters.userUid)
      const sendDbUserData = db.collection('user-data').doc(payload.sendUserUid)
      // console.log('payload.sendUserUid',payload.sendUserUid)
      const wallet= parseInt(payload.wallet)
      let sendUserWallet = parseInt(payload.sendUserWallet)
      context.commit('changeLoginUserWallet',wallet)
      sendUserWallet = sendUserWallet + wallet
      db.runTransaction(async (transaction) => {
        // const userGetData = await transaction.get(userData)
        // const sendUserGetData = await transaction.get(payload.sendUserUid)
        // const userData = latestgetData.data()
        // const sendUserData = sendUserGetData.data()
        console.log('sendUserWallet',sendUserWallet)
        transaction.update(
          dbUserData,
          {wallet: context.getters.wallet},
        )
        transaction.update(
          sendDbUserData,
          {wallet: sendUserWallet},
        )
        console.log('update')
      }).then(() => {
        console.log('successfully committed!')
      }).catch((error) => {
        console.log('Transaction failed: ', error)
      })
      db.collection('user-data')
      .where('userName', '!=', context.getters.userName)
      .get()
      .then((querySnapshot) => {
        const userData = []
        querySnapshot.forEach((doc) => {
          console.log('test')
          userData.push(doc.data())
        })
        console.log('userData',userData)
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
