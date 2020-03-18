<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      @open="handleOpen"
      @close="handleClose"
      background-color="#00233C"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      :collapse="isCollapse"
      router
      :default-active="$route.path"
    >
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
  import {mapState} from "vuex";

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
        this.$api.menuTree().then(res => {
          this.menuItems = res.data;
          // console.log(res.data)
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error("获取菜单列表失败")
        })
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      }
    },
    computed: mapState({
      // 侧栏开闭合设置
      isCollapse: state => state.isCollapse
    })
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
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
</style>
