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
      unique-opened>
      <template v-for="item in items">
        <template v-if="item.subs">
          <!--一级菜单-->
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span >{{item.title}}</span>
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
                >{{ threeItem.title }}</el-menu-item>
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
            icon: 'el-icon-s-cascades',
            index: 'table',
            title: '基础表格'
          },
          {
            icon: 'el-icon-lx-copy',
            index: 'tabs',
            title: 'tab选项卡'
          },
          {
            icon: 'el-icon-lx-calendar',
            index: '3',
            title: '表单相关',
            subs: [
              {
                index: 'form',
                title: '基本表单'
              },
              {
                index: '3-2',
                title: '三级菜单',
                subs: [
                  {
                    index: 'editor',
                    title: '富文本编辑器'
                  },
                  {
                    index: 'markdown',
                    title: 'markdown编辑器'
                  }
                ]
              },
              {
                index: 'upload',
                title: '文件上传'
              }
            ]
          },
          {
            icon: 'el-icon-lx-emoji',
            index: 'icon',
            title: '自定义图标'
          },
          {
            icon: 'el-icon-pie-chart',
            index: 'charts',
            title: 'schart图表'
          },
          {
            icon: 'el-icon-rank',
            index: '6',
            title: '拖拽组件',
            subs: [
              {
                index: 'drag',
                title: '拖拽列表'
              },
              {
                index: 'dialog',
                title: '拖拽弹框'
              }
            ]
          },
          {
            icon: 'el-icon-lx-global',
            index: 'i18n',
            title: '国际化功能'
          },
          {
            icon: 'el-icon-lx-warn',
            index: '7',
            title: '错误处理',
            subs: [
              {
                index: 'permission',
                title: '权限测试'
              },
              {
                index: '404',
                title: '404页面'
              }
            ]
          },
          {
            icon: 'el-icon-lx-redpacket_fill',
            index: '/donate',
            title: '支持作者'
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
    }
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
