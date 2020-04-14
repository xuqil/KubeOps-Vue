<template>
  <el-container class="home_container">
    <el-aside :width="asideWidth">
      <side-menu/>
    </el-aside>
    <el-container>
      <el-header>
        <head-bar/>
      </el-header>
      <el-main :style="{'background-color': getMainBackgroundColor}">
        <keep-alive >
          <router-view v-if="$route.meta.keepAlive && isRouterActive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive && isRouterActive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SideMenu from "components/common/menu/SideMenu";
  import HeadBar from "components/common/headBar/HeadBar";
  import {mapGetters} from "vuex";

  export default {
    name: "Home",
    //页面刷新
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterActive: true,
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
      //刷新页面
      reload() {
        this.isRouterActive = false;
        this.$nextTick(function () {
          this.isRouterActive = true
        })
      },
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
      },
      ...mapGetters([
        'getMainBackgroundColor'
      ]),
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
  }
</style>
