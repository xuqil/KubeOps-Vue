<template>
  <el-container  class="home_container">
    <el-header><head-bar/></el-header>
    <el-container>
      <el-aside  :width="asideWidth"><side-menu/></el-aside>
      <el-main>Mainfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SideMenu from "components/common/menu/SideMenu";
  import HeadBar from "components/common/headBar/HeadBar";

  export default {
    name: "Home",
    data() {
      return {

      }
    },
    components: {
      SideMenu,
      HeadBar
    },
    computed: {
      //随侧边栏开闭调正侧边栏宽度
      asideWidth(){
        return this.$store.getters.isCollapse ? '64px' : '200px'
      }
    }
  }
</script>

<style scoped>
  .home_container{
    height: 100%;
  }
  .el-header{
    padding: 0;
  }
  .el-aside{
    text-align: left;flex:0 1 auto;
  }
</style>
