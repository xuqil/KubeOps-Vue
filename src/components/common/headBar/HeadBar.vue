<template>
  <div class="header-bar">
    <div class="collapse-btn" @click="changeCollapse">
      <i v-if="Collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">
      <div>KubeOps运维平台</div>
    </div>
    <div class="header-container">
      <div class="header-items">
        <el-button type="text" icon="el-icon-full-screen" @click="changeFullScreen">全屏</el-button>
        <el-button type="text" icon="el-icon-bell">通知</el-button>
        <el-dropdown class="dropdown" @command="handleCommand">
          <span class="el-dropdown-link">
            {{getUsername}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="password">账户设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapState} from 'vuex'

  export default {
    name: "HeadBar",
    data() {
      return {};
    },
    methods: {
      ...mapMutations([
        //修改侧栏开闭
        'isCollapse'
      ]),
      changeCollapse() {
        this.isCollapse()
      },
      //全屏函数
      changeFullScreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      },
      //退出登录
      handleCommand(command) {
        if (command === 'logout') {
          window.sessionStorage.clear();
          this.$router.push('/login')
        } else {
          this.$router.push('/user')
        }
      }
    },
    computed:
      {
        ...mapState({
          // 侧栏开闭合设置
          Collapse: state => state.isCollapse
        }),
        ...mapGetters([
          //登录的用户名
          'getUsername'
        ]),
      }
  }
</script>

<style scoped>
  .header-bar {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    background-color: #00172c;
    font-size: 22px;
    color: #fff;
  }

  /*使用浮动对顶栏组件布局*/
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

  .header-container {
    float: right;
    height: 100%;
  }

  .header-items {
    display: flex;
    flex-direction: row;
    height: 100%;
    font-size: 17px;
    align-items: center
  }

  .el-button {
    padding-right: 15px;
    font-size: 18px;
    color: #fff;
  }

  .el-button:focus {
    color: rgb(32, 160, 255);
  }

  .dropdown {
    padding-left: 10px;
    padding-right: 15px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
    font-size: 18px;
  }

  .el-icon-arrow-down {
    display: inline-block;
    height: 100%;
    font-size: 17px;
  }
</style>
