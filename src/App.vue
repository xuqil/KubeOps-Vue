<template>
  <div id="app">
<!--    <login></login>-->
    <register/>
<!--    <test/>-->
  </div>
</template>


<script>
  import Login  from "components/common/login/Login"
  import Register from "components/common/login/Register";
  import Test from "components/Test";

  export default {
    data() {
      return {
        message: "Hello"
      }
    },
    components: {
      Test, //测试组件
      Login,
      Register,
    }
  }
</script>

<style scoped>
  @import "assets/css/base.css";
</style>
