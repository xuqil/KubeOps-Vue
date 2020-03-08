<template>
  <div class="header-bar">
    <div class="collapse-btn" @click="changeCollapse">
      <i v-if="isCollapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">
      <div>KubeOps运维平台</div>
    </div>
    <div class="headerMenu">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        background-color="#242f42"
        text-color="#fff"
        active-text-color="#ffd04b"
        id="header-menu">
        <template v-for="item in items">
          <!--具有二级菜单的选项-->
          <el-submenu v-if="item.subs" :index="item.index" :style="{order: item.order}">
            <template slot="title"><i :class="item.icon"></i>{{item.title}}</template>
            <!-- 二级菜单的选项-->
            <el-menu-item v-for="sub in item.subs" :key="sub.title" :index="sub.index">{{sub.title}}</el-menu-item>
          </el-submenu>
          <!--一级菜单选项-->
          <el-menu-item v-else :index="item.index" :style="{order: item.order}"><i :class="item.icon"></i>{{item.title}}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: "HeadBar",
    data() {
      return {
        activeIndex: '1',
        //菜单选项，index请求路径，order为倒序数字，icon有没有都可以
        items: [
          {
            // icon: 'el-icon-caret-bottom',
            order: 1,
            index: 'admin',
            title: "Admin",
            //二级菜单没有order
            subs: [
              {
                index: 'user-setting',
                title: '设置'
              },
              {
                index: 'logout',
                title: '注销'
              }
            ]
          },
          {
            icon: 'el-icon-bell',
            order: 2,
            index: 'messages',
            title: '消息中心'
          },
          {
            icon: 'el-icon-full-screen',
            order: 3,
            index: 'screen',
            title: '全屏'
          }
        ]
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      ...mapMutations([
        //修改侧栏开闭
        'isCollapse'
      ]),
      changeCollapse(){
        this.isCollapse()
      }
    }
  }
</script>

<style scoped>
  #header-menu {
    display: flex;
    flex-direction: row-reverse;
    height: 70px;
  }

  .header-bar {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    background-color: #242f42;
    font-size: 22px;
    color: #fff;
  }

  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }

  .logo {
    float: left;
    line-height: 70px;
    text-align: left;
  }

  .headerMenu {
    float: right;
  }

  .header-bar > ul > li {
    height: 100%;
  }
</style>
