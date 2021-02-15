<template>
  <div>
    <!-- <p>{{ this.$store.getters.userName }}さん</p> -->
    <p>{{ userName }}さん</p>
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
    console.log('test', this.$store.getters.userName)
    this.userName = this.$store.getters.userName
    this.email = this.$store.getters.email
  }
}
</script>
