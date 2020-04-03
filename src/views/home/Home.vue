<template>
  <el-container class="home_container">
    <el-aside :width="asideWidth">
      <side-menu/>
    </el-aside>
    <el-container>
      <el-header>
        <head-bar/>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
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
    created() {
      this.getBackgroundColor();
    },
    methods: {
      getBackgroundColor() {
        this.$api.backgroundColorGet().then(res => {
          let backgroundColorList = res.data.results;
          this.$store.commit('saveBackgroundColor', backgroundColorList);
          backgroundColorList.forEach(value => {
            if (value.code === 1) {
              this.$store.commit('saveHeadBackgroundColor', value.color)
            } else if (value.code === 2) {
              this.$store.commit('saveMenuBackgroundColor', value.color)
            } else if (value.code === 3) {
              this.$store.commit('saveMainBackgroundColor', value.color)
            }
          })
        }).catch(err => {
          console.log(err);
          return this.$message.error('获取背景颜色配置失败!')
        })
      }
    },
    computed: {
      //随侧边栏开闭调正侧边栏宽度
      asideWidth() {
        return this.$store.getters.isCollapse ? '64px' : '200px'
      }
    }
  }
</script>

<style scoped>
  .home_container {
    height: 100%;
  }

  .el-header {
    padding: 0;
    height: 70px !important;
  }

  .el-aside {
    text-align: left;
    flex: 0 1 auto;
  }
</style>
