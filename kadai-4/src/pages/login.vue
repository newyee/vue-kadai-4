<template>
  <div>
    <h1>新規登録</h1>
    <p>
      <label for="mail">メールアドレス:</label>
      <input type="text" id="mail" v-model="email">
    </p>
    <p>
      <label for="password">パスワード</label>
      <input type="text" id="password" v-model="password">
    </p>
    <div>
      <button @click="login">ログイン</button>
    </div>
    <router-link to="/register">新規登録はこちら</router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      const userData = {
        email: this.email,
        password: this.password
      }
      await this.$store.dispatch('login', userData)
      this.$router.push({
        name: 'dashboard'
      })
    }
  }
}
</script>
