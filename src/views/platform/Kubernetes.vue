<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>平台管理</el-breadcrumb-item>
      <el-breadcrumb-item>Kubernetes管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Pod管理" name="pod">
          <Pod></Pod>
        </el-tab-pane>
        <el-tab-pane label="Deployment管理" name="deployment">
          <Deployment></Deployment>
        </el-tab-pane>
        <el-tab-pane label="命名空间管理" name="namespace">
          <Namespace></Namespace>
        </el-tab-pane>
        <el-tab-pane label="节点管理" name="node">
          <Node></Node>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Pod from "./Pod";
  import Deployment from "./Deployment";
  import Namespace from "./Namespace";
  import Node from "./Node";

  export default {
    name: "Kubernetes",
    data() {
      return {
        activeName: 'pod'
      };
    },
    components: {
      Pod,
      Deployment,
      Namespace,
      Node
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
  }
</script>

<style scoped>

</style>
