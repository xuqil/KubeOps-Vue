<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
  </div>
</template>


<script>

  export default {
    data() {
      return {
        message: "Hello"
      }
    },
    components: {
    }
  }
</script>

<style scoped>
  @import "assets/css/base.css";
</style>
