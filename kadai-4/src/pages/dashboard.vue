<template>
  <div>
    <div class="main-content">
      <div class="header-content">
        <p v-if="userName">ようこそ！{{ userName }}さん</p>
        <p v-if="wallet">残高: {{ wallet }}</p>
        <button @click="logout">ログアウト</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>
                ユーザー名
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>test</td>
              <td>test2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import firebase from 'firebase'
import store from '../store/index'
  export default {
    async created(){
      firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
          user = user ? user : {}
          console.log('user',user)
          const db = firebase.firestore()
          if (user.uid){
            store.commit('setUserUid', user.uid)
            db
            .collection('user-data')
            .doc(user.uid)
            .get()
            .then(doc => {
              const userName = doc.data().userName
              // console.log('userName',userName)
              const wallet = doc.data().wallet
              const payload = {
                userName,
                wallet,
              }
              store.commit('saveUserData', payload)
              db.collection('user-data').where('user-data', '!=', userName).get().then(response => {
                console.log('response',response)
              })
            })
            .catch(error => {
              console.log('エラー',error)
            })
          }
        }
      })
    },
    computed: {
      userName() {
        return this.$store.getters.userName
      },
      wallet() {
        return this.$store.getters.wallet
      },
    },
    methods: {
      async logout(){
        await this.$store.dispatch('logout')
      }
    },
  }
</script>
<style lang="scss">
.main-content{
  width:1000px;
  margin: 0 auto;
  .header-content{
    display: flex;
    justify-content: space-evenly;
  }
}
</style>>


