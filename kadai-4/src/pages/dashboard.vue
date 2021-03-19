<template>
  <div>
    <p>ようこそ！{{ userName }}さん</p>
    <p>残高: {{ wallet }}</p>
    <p>{{ this.$store.getters.loggedIn }}</p>
  </div>
</template>
<script>
/* eslint-disable */
  export default {
    created(){
      console.log('aaa')
      this.$store.dispatch('onAuth')
      this.loggedIn = this.$store.getters.loggedIn
      if (this.$store.getters.loggedIn == false){
        this.$router.push({
          name: 'login',
        })
      }
    },
    data() {
      return {
        userName: '',
        wallet: '',
        loggedIn:''
      }
    },
    created() {
      this.userName = this.$store.getters.userName
      this.wallet = this.$store.getters.wallet
    },
  }
</script>
