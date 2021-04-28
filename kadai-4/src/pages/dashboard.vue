<template>
  <div>
    <div class="main-content">
      <div class="header-content">
        <p v-if="userName">ようこそ！{{ userName }}さん</p>
        <p v-if="wallet">残高: {{ wallet }}</p>
        <button @click="logout">ログアウト</button>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  export default {
    async created(){
      // try {
      //   firebase.auth().onAuthStateChanged(function (user) {
      //     if (user) {
      //       console.log('ログイン状態の取得')
      //       user = user ? user : {}
      //       const db = firebase.firestore()
      //       console.log('データベース情報取得')
      //       if (user.uid){
      //         store.commit('setUserUid', user.uid)
      //         console.log('ユーザーIDの保存')
      //         db
      //         .collection('user-data')
      //         .doc(user.uid)
      //         .get()
      //         .then(doc => {
      //           const userName = doc.data().userName
      //           const wallet = doc.data().wallet
      //           const payload = {
      //             userName: userName,
      //             wallet: wallet,
      //             loggedIn:true
      //           }
      //           store.commit('saveUserData', payload)
      //           console.log('ユーザー情報保存')
      //         })
      //         .catch(error => {
      //           console.log('エラー',error)
      //         })
      //       }
      //       next({
      //         path: '/dashboard',
      //       })
      //       // console.log('user',user)
      //       // console.log(next)
      //     } else {
      //       next()
      //     }
      //   })
      //   } catch (error) {
      //     console.log(error)
      //   }
      console.log('test',this.$route.params)
    },
    computed: {
      userName() {
        return this.$store.getters.userName
      },
      wallet() {
        return this.$store.getters.wallet
      },
      // loggedIn(){
      //   return this.$store.getters.loggedIn
      // }
    },
    methods: {
      async logout(){
        await this.$store.dispatch('logout')
        let loggedIn = this.$store.getters.loggedIn
        if(loggedIn === false){
          this.$router.push({
            name:'login'
          })
        }

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


