<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :background-color="getMenuBackgroundColor"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      :collapse="getCollapse"
      :collapse-transition="false"
      router
      :default-active="$route.path"
    >
      <el-menu-item index="/home" v-show="!getCollapse">
        <span class="menu-logo">KubeOps运维平台</span>
      </el-menu-item>
      <template v-for="item in menuItems">
        <!--一级菜单-->
        <el-submenu v-if="item.children" :index="item.id + ''">
          <template slot="title">
            <i v-if="item.icon" :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <template slot="title">
              <i v-if="subItem.icon" :class="subItem.icon"></i>
              <i v-else class="el-icon-menu"></i>
              <span>{{subItem.title}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <!--没有二级菜单的一级菜单-->
        <el-menu-item v-else :index="item.path">
          <i v-if="item.icon" :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "SideMenu",
    data() {
      return {
        menuItems: []
      }
    },
    created() {
      this.getMenuTree();
    },
    methods: {
      getMenuTree() {
        this.$api.Rights.menuTree().then(res => {
          this.menuItems = res.data;
          // console.log(res.data)
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      }
    },
    computed: {
      ...mapGetters([
        'getMenuBackgroundColor',
        'getCollapse'
      ]),
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .sidebar > ul {
    height: 100%;
  }

  .menu-logo {
    font-family: 微软雅黑;
    font-weight: bold;
    font-size: 20px
  }
</style>
