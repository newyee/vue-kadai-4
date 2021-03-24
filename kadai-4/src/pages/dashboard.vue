<template>
  <div>
    <p v-cloak>ようこそ！{{ userName }}さん</p>
    <p v-cloak>残高: {{ wallet }}</p>
    <p>{{ this.$store.getters.loggedIn }}</p>
  </div>
</template>
<script>
/* eslint-disable */
  export default {
    created(){

    },
    mounted() {
      console.log('1')
      this.$store.dispatch('onAuth')
      console.log('2')
      this.loggedIn = this.$store.getters.loggedIn
      console.log('3')
      if (this.$store.getters.loggedIn == false){
        this.$router.push({
          name: 'login',
        })
      }
      if(this.loggedIn){
        this.userName = this.$store.getters.userName
        this.wallet = this.$store.getters.wallet
        console.log('ok',this.$store.getters.wallet)

      }
      console.log('ng',this.$store.getters.wallet)
    },
    data() {
      return {
        userName: '',
        wallet: '',
        loggedIn:''
      }
    },
  }
</script>
