<template>
  <div>
    <p v-if="userName">ようこそ{{ userName }} さん</p>
  </div>
</template>
<script>
export default {
  props: {
    userName: {
      type: String,
      require: false,
      default: null
    }
  }
}
</script>
