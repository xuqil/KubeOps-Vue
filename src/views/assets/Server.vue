<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>主机管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加主机按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加主机</el-button>
        </el-col>
      </el-row>
      <!--主机列表-->
      <el-table :data="serversList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="主机名" prop="hostname"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="设备类型" prop="device_type"></el-table-column>
        <el-table-column label="操作系统版本" prop="os_version"></el-table-column>
        <el-table-column label="服务器状态" prop="status"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeServerById(scope.row.id)" size="mini">删除
            </el-button>
            <el-button type="info" icon="el-icon-info" @click="showServerDetail(scope.row.id)" size="mini">详细信息
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
    name: "Server",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        serversList: []
      }
    },
    created() {
      this.getServersList()
    },
    methods: {
      getServersList(){
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
      showEditDialog(id) {

      },
      removeServerById(id) {

      },
      showServerDetail(id){

      }
    }
  }
</script>

<style scoped>

</style>
