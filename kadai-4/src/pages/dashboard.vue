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
              <th>ユーザー名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(userData, index) in userList" v-bind:key="index">
              <td>{{ userData.userName }}</td>
              <td>{{ userData }}</td>
              <td>
                <button
                  @click="openUserInfo(userData.userName, userData.wallet)"
                >
                  walletを見る
                </button>
              </td>
              <td><button @click="throwWallet(wallet)">送る</button></td>
            </tr>
          </tbody>
        </table>
        <div id="overlay" v-show="showContent">
          <div id="content">
            <p>{{ displayUserName }}さんの残高</p>
            <p>{{ displayWalletData }}</p>
            <p><button @click="closeModal">close</button></p>
          </div>
        </div>
        <div id="overlay" v-show="throwWalletContent">
          <div id="content">
            <p>あなたの残高: {{ loginUserWallet }}</p>
            <p>送る金額</p>
            <input v-model="throwWalletValue" type="number" />
            <button @click="sendWallet(throwWalletValue)">送信</button>
            <p><button @click="closeWalletModal">close</button></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
  import firebase from 'firebase'
  import store from '../store/index'
  export default {
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.loginUser = user
          user = user ? user : {}
          const db = firebase.firestore()
          if (user.uid) {
            store.commit('setUserUid', user.uid)
            db.collection('user-data')
              .doc(user.uid)
              .get()
              .then((doc) => {
                const userName = doc.data().userName
                const wallet = doc.data().wallet
                const payload = {
                  userName,
                  wallet,
                }
                store.commit('saveUserData', payload)
                db.collection('user-data')
                  .where('userName', '!=', userName)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      this.userList.push(doc.data())
                    })
                  })
              })
              .catch((error) => {
                console.log('エラー', error)
              })
          }
        }
      })
    },
    data() {
      return {
        userList: [],
        showContent: false,
        displayUserName:'',
        displayWalletData:'',
        throwWalletContent:false,
        loginUserWallet:'',
        throwWalletValue:'',
        loginUser:''
      }
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
      openUserInfo(userName,wallet){
        this.showContent = true
        this.displayUserName = userName
        this.displayWalletData = wallet
      },
      throwWallet(loginUserWallet){
        this.loginUserWallet = loginUserWallet
        console.log('loginUserWallet',loginUserWallet)
        this.throwWalletContent = true
      },
      closeModal(){
        this.showContent = false
      },
      closeWalletModal(){
        this.throwWalletContent = false
      },
      sendWallet(wallet){
        const payload = {
          wallet,
        }
        store.commit('throwWallet',payload)
        // db.collection('user-data').doc('')

        console.log(this.wallet)
      },
      async logout() {
        await this.$store.dispatch('logout')
      },
    },
  }
</script>
<style lang="scss">
.main-content {
  width: 1000px;
  margin: 0 auto;
  .header-content {
    display: flex;
    justify-content: space-evenly;
  }
  table {
    margin-left: 17%;
    width: 60%;
  }
  #overlay {
    /*　要素を重ねた時の順番　*/
    z-index:1;

    /*　画面全体を覆う設定　*/
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,0.5);

    /*　画面の中央に要素を表示させる設定　*/
    display: flex;
    align-items: center;
    justify-content: center;
    #content {
      z-index:2;
      width:50%;
      padding: 1em;
      background:#fff;
    }

  }
}
</style>


