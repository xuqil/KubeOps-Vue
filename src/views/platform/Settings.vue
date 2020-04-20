<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>平台管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="text_style">顶部导航栏背景颜色:</div>
          <div class="color_div" :style="{ 'background-color': headColor}"><i class="el-icon-magic-stick"></i></div>
          <div class="color_style">
            <el-color-picker size="mini" v-model="headColor" show-alpha @active-change="changeHead"></el-color-picker>
          </div>
          <span class="color_button"><el-button type="info" size="mini" @click="restHead">重置</el-button></span>
          <el-button type="primary" size="mini" @click="saveHead">保存</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="text_style">侧边菜单栏背景颜色:</div>
          <div class="color_div" :style="{ 'background-color': menuColor}"><i class="el-icon-magic-stick"></i></div>
          <div class="color_style">
            <el-color-picker size="mini" v-model="menuColor" show-alpha @active-change="changeMenu"></el-color-picker>
          </div>
          <span class="color_button"><el-button type="info" size="mini" @click="restMenu">重置</el-button></span>
          <el-button type="primary" size="mini" @click="saveMenu">保存</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="text_style">页面主体背景颜色:</div>
          <div class="color_div" :style="{ 'background-color': mainColor}"><i class="el-icon-magic-stick"></i></div>
          <div class="color_style">
            <el-color-picker size="mini" v-model="mainColor" show-alpha @active-change="changeMain"></el-color-picker>
          </div>
          <span class="color_button"><el-button type="info" size="mini" @click="restMain">重置</el-button></span>
          <el-button type="primary" size="mini" @click="saveMain">保存</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "Settings",
    data() {
      return {
        headColor: 'rgba(245, 245, 245, 1)',
        menuColor: 'rgba(19, 206, 102, 0.8)',
        mainColor: 'rgba(19, 206, 102, 0.8)',

        getHea: '',
        getMenu: '',
        getMain: ''
      }
    },
    mounted() {
      this.headColor = this.Head;
      this.menuColor = this.Menu;
      this.mainColor = this.Main;

      this.getHea = this.Head;
      this.getMenu = this.Menu;
      this.getMain = this.Main;
    },
    computed: mapState({
      Head: state => state.headBackgroundColor,
      Menu: state => state.menuBackgroundColor,
      Main: state => state.mainBackgroundColor,
      ColorList: state => state.backgroundColor,
    }),
    methods: {
      changeHead(value) {
        // console.log(value)
        this.$store.commit('saveHeadBackgroundColor', value)
      },
      changeMenu(value) {
        // console.log(value)
        this.$store.commit('saveMenuBackgroundColor', value)
      },
      changeMain(value) {
        // console.log(value)
        this.$store.commit('saveMainBackgroundColor', value)
      },
      saveHead() {
        let resultHead = '';
        this.ColorList.forEach(value => {
          if (value.code === 1) {
            value.color = this.headColor;
            resultHead = value;
          }
        });
        this.$api.Settings.backgroundColorPut(resultHead.id, resultHead).then(res => {
          console.log(resultHead.id)
          this.$message.success('修改成功!')
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      saveMenu() {
        let resultMenu = '';
        this.ColorList.forEach(value => {
          if (value.code === 2) {
            value.color = this.menuColor;
            resultMenu = value;
          }
        });
        this.$api.Settings.backgroundColorPut(resultMenu.id, resultMenu).then(res => {
          console.log(resultMenu.id)
          this.$message.success('修改成功!')
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      saveMain() {
        let resultMain = '';
        this.ColorList.forEach(value => {
          if (value.code === 3) {
            value.color = this.mainColor;
            resultMain = value;
          }
        });
        this.$api.Settings.backgroundColorPut(resultMain.id, resultMain).then(res => {
          console.log(resultMain.id)
          this.$message.success('修改成功!')
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      restHead() {
        this.headColor = this.getHea;
        this.$store.commit('saveHeadBackgroundColor', this.getHea)
      },
      restMenu() {
        this.menuColor = this.getMenu;
        this.$store.commit('saveMenuBackgroundColor', this.getMenu)
      },
      restMain() {
        this.mainColor = this.getMain;
        this.$store.commit('saveMainBackgroundColor', this.getMain)
      },
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .color_style {
    display: inline-block;
    vertical-align: top
  }

  .text_style {
    width: 200px;
    text-align: right;
    border-radius: 10px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }

  .color_div {
    width: 200px;
    text-align: center;
    border-radius: 10px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }

  .color_button {
    margin-left: 200px;
    margin-right: 10px;
  }
</style>
