<template>
<div>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>应用部署</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>

  </el-card>
</div>
</template>

<script>
    export default {
        name: "Deployment"
    }
</script>

<style scoped>

</style>
