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
    <!--其他远程登录区域-->
    <el-dialog
      title="登录服务器"
      :visible.sync="otherConnectDialogVisible"
      width="50%"
      @close="otherConnectDialogClosed">
      <el-form ref="form" :model="otherServerForm" label-width="80px" v-show="isHide">
        <el-form-item label="主机地址">
          <el-input v-model="otherServerForm.host"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="otherServerForm.port"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="otherServerForm.user"></el-input>
        </el-form-item>

        <el-form-item label="认证类型">
          <el-radio-group v-model="otherServerForm.type">
            <el-radio label="pwd" checked>密码认证</el-radio>
            <el-radio label="key">秘钥认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" v-if="otherServerForm.type === 'pwd'">
          <el-input type="password" show-password v-model="otherServerForm.password"></el-input>
        </el-form-item>

        <el-form-item label="秘钥文件" v-else>
          <el-upload
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="mini" type="info">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="otherConnectServer">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
        isHide: true,
        otherServerForm: {
          host: '192.168.1.11',
          port: 22,
          user: 'xql',
          type: 'pwd',
          password: '19218xql'
        },
        fileList: []
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      otherConnectDialogClosed() {

      },
      otherConnectServer() {

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
