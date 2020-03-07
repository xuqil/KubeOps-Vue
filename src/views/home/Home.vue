<template>
<!--  <el-container ref="homePage">-->
<!--    <el-aside width="200px" style="background-color: #545c64; margin-bottom: 0">-->
      <side-menu/>
<!--    </el-aside>-->
<!--    <el-container>-->
<!--      <el-header>Header</el-header>-->
<!--      <el-main>Main</el-main>-->
<!--      <el-footer>Footer</el-footer>-->
<!--    </el-container>-->
<!--  </el-container>-->
</template>

<script>
  import SideMenu from "components/common/Menu/SideMenu";

  export default {
    name: "Home",
    data() {
      return {
        clientHeight: '',
      }
    },
    components: {
      SideMenu
    },
    mounted() {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`;
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    },
    watch: {
      // // 如果 `clientHeight` 发生改变，这个函数就会运行
      // clientHeight: function () {
      //   this.changeFixed(this.clientHeight)
      // }
    },

    methods: {
      // changeFixed(clientHeight) { //动态修改样式
      //   this.$refs.homePage.$el.style.height = clientHeight - 20 + 'px';
      // },
    },
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
