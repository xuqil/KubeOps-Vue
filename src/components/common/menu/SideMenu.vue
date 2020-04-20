<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :background-color="Color"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      :collapse="Collapse"
      :collapse-transition="false"
      router
      :default-active="$route.path"
    >
      <el-menu-item index="">
        <div class="collapse-btn" @click="changeCollapse">
          <i v-if="Collapse" class="el-icon-s-fold"></i>
          <i v-else class="el-icon-s-unfold"></i>
        </div>
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
  import {mapMutations, mapState} from "vuex";

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
      ...mapMutations([
        //修改侧栏开闭
        'isCollapse'
      ]),
      changeCollapse() {
        this.isCollapse()
      },
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
    computed: mapState({
      // 侧栏开闭合设置
      Collapse: state => state.isCollapse,
      Color: state => state.menuBackgroundColor,
    })
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

  .collapse-btn {
    cursor: pointer;
  }
</style>
