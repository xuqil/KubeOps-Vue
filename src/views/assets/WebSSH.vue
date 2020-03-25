<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>远程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 远程登录按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="otherConnectDialogVisible = true">远程登录</el-button>
        </el-col>
      </el-row>
      <!--主机列表-->
      <el-table :data="serversList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="主机名" prop="hostname"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="设备类型" prop="device_type"></el-table-column>
        <el-table-column label="操作系统版本" prop="os_version"></el-table-column>
        <el-table-column label="应用环境" prop="app_env"></el-table-column>
        <el-table-column label="登录用户" prop="username"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" @click="connectServer(scope.row.id)" size="mini">远程登录
            </el-button>
            <el-button type="danger" @click="stopConnect(scope.row.id)" size="mini">终止远程
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "WebSSH",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        //服务器列表
        serversList: [],
        otherConnectDialogVisible: false,

      }
    },
    created() {
      this.getServersList()
    },
    methods: {
      getServersList() {
        this.$api.serversGet(this.queryInfo).then(res => {
          this.serversList = res.data.results;
          this.total = res.data.count;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取主机列表失败！')
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getTagsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getTagsList()
      },
      connectServer() {

      },
      stopConnect() {

      },
    }
  }
</script>

<style scoped>

</style>
