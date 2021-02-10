<template>
  <div>
    <h1>新規登録</h1>
    <p>
      <label for="user-name">ユーザー名:</label>
      <input type="text" id="user-name" v-model="userName" >
    </p>
    <p>
      <label for="mail">メールアドレス:</label>
      <input type="text" id="mail" v-model="email">
    </p>
    <p>
      <label for="password">パスワード</label>
      <input type="text" id="password" v-model="password">
    </p>
    <div>
      <button @click="register">新規登録</button>
    </div>
    <router-link to="/login">ログインはこちら</router-link>
  </div>
</template>
<script>
import axios from '../axios-auth'
export default {
  data () {
    return {
      userName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    register () {
      axios.post('/accounts:signUp?key=AIzaSyD-8X_eLWbZ-XW0tanR2RnUHi0hOtQPSrk',
        {
          email: this.email,
          password: this.password,
          returnSecureToken: true
        }
      ).then(response => {
        this.$router.push({
          name: 'dashboard',
          params: { userName: this.userName }
        })
      })
    }
  }
}
</script>
