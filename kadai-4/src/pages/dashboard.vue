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
    created(){
      this.$store.dispatch('onAuth')
      let loggedIn = this.$store.getters.loggedIn
      if (loggedIn === false){
        this.$router.push({
          name: 'login',
        })
      }
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
      logout(){
        this.$store.dispatch('logout')
        let loggedIn = this.$store.getters.loggedIn
        console.log('aaaaa',loggedIn)
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


