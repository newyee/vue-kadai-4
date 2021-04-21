<template>
  <div>
    <h1>新規登録</h1>
    <p>
      <label for="user-name">ユーザー名:</label>
      <input type="text" id="user-name" v-model="userName" />
    </p>
    <p>
      <label for="mail">メールアドレス:</label>
      <input type="text" id="mail" v-model="email" />
    </p>
    <p>
      <label for="password">パスワード</label>
      <input type="text" id="password" v-model="password" />
    </p>
    <div>
      <button @click="register">新規登録</button>
    </div>
    <router-link to="/login">ログインはこちら</router-link>
  </div>
</template>
<script>
/* eslint-disable */
  export default {
    created() {
      // this.$store.dispatch('onAuth')
      if (this.$store.getters.loggedIn){
        this.$router.push({
          name: 'dashboard',
        })
      }
    },
    data() {
      return {
        userName: '',
        email: '',
        password: '',
      }
    },
    methods: {
      async register() {
        const userData = {
          userName: this.userName,
          email: this.email,
          password: this.password,
        }
        await this.$store.dispatch('registerUserData', userData)
        this.$router.push({
          name: 'dashboard',
        })
      },
    },
  }
</script>
