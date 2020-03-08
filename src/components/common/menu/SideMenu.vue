<template>
  <div class="sidebar">
    <el-menu
      default-active="1"
      class="sidebar-el-menu"
      @open="handleOpen"
      @close="handleClose"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      :collapse="isCollapse"
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <!--一级菜单-->
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <template v-for="subItem in item.subs">
              <!--二级菜单-->
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index">
                <template slot="title">{{subItem.title}}</template>
                <!--二级菜单选项-->
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <!--没有三级菜单的一级菜单选项-->
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!--没有二级菜单的一级菜单-->
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
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
        items: [
          {
            icon: 'el-icon-s-home',
            index: 'home',
            title: '系统首页'
          },
          {
            icon: 'el-icon-setting',
            index: 'platform',
            title: '平台管理'
          },
          {
            icon: 'el-icon-goods',
            index: 'assets',
            title: '资产管理'
          },
          {
            icon: 'el-icon-bangzhu',
            index: 'deployment',
            title: '应用部署'
          },
          {
            icon: 'el-icon-time',
            index: 'task',
            title: '任务管理'
          },
          {
            icon: 'el-icon-user',
            index: 'profile',
            title: '用户管理',
            subs: [
              {
                index: 'permissions',
                title: '权限管理'
              },
              {
                index: 'user',
                title: '账户设置'
              }
            ]
          },
          {
            icon: 'el-icon-folder',
            index: 'file',
            title: '文件管理',
            subs: [
              {
                index: 'upload',
                title: '文件上传'
              },
              {
                index: 'download',
                title: '文件下载'
              }
            ]
          },
          {
            icon: 'el-icon-chat-line-square',
            index: 'wiki',
            title: 'WIKI'
          },
          {
            icon: 'el-icon-monitor',
            index: 'monitor',
            title: '监控管理'
          }
        ]
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
