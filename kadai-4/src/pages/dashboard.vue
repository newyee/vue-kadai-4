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
              <td><button @click="onAlert()">walletを見る</button></td>
              <td><button>送る</button></td>
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
  import VuejsDialog from 'vuejs-dialog'
  Vue.use(VuejsDialog);
  export default {
    async created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
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
                      // console.log(doc.data())
                      this.userList.push(doc.data())
                      // console.log('data',this.userList)
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
        //　省略
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
      async logout() {
        await this.$store.dispatch('logout')
      },
      onAlert:function(){
        this.$dialog
        .confirm({
          title: '最終確認',
          body: '本当に削除してもよろしいですか？'
        },{
          okText: 'はい',
          cancelText: 'キャンセル',
        })
        .then(function() {
          console.log('実行しました');
        })
        .catch(function() {
          console.log('実行はキャンセルされました');
        })
      }
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
  table{
    margin-left: 17%;
    width: 60%;
  }
}
</style>


