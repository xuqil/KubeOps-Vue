<template>
  <el-container>
    <el-header style="padding: 0"><head-bar/></el-header>
    <el-container>
      <el-aside width="250px" style="text-align: left;"><side-menu/></el-aside>
      <el-main>Main</el-main>
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
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
