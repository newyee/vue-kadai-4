<template>
  <div>
    <p v-if="userName">ようこそ{{ userName }} さん</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userName: '',
      email: ''
    }
  },
  mounted () {
    this.userName = this.$store.getters.userName
    this.email = this.$store.getters.email
  }
}
</script>
