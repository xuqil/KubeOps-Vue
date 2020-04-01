<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件管理</el-breadcrumb-item>
      <el-breadcrumb-item>文件上传</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--主机列表-->
      <el-table :data="serversList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="主机名" prop="hostname"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="设备类型" prop="device_type"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-upload2" @click="showUploadDialog(scope.row.id)" size="mini">文件上传
            </el-button>
            <el-button type="danger" icon="el-icon-download" @click="showDownloadDialog(scope.row.id)" size="mini">文件下载
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
    <!--主机列表的文件操作-->
    <el-dialog
      title="文件操作"
      :visible.sync="fileDialogVisible"
      width="50%"
      @close="FileDialogClosed">
      <el-form
        ref="serverFormRef"
        :rules="serverFormRules"
        :model="serverForm" l
        label-width="80px">
        <el-form-item label="主机地址">
          <el-input v-model="serverForm.ip" disabled></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="serverForm.port"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="serverForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="serverForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="serverForm.opt === 'upload'" label="文件路径" prop="path">
          <el-input v-model="serverForm.path"></el-input>
        </el-form-item>
        <el-form-item v-else label="文件" prop="path">
          <el-input v-model="serverForm.path"></el-input>
        </el-form-item>
        <el-form-item v-if="serverForm.opt === 'upload'">
          <el-upload
            ref="upload"
            drag
            :action="uploadUrl"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-error="uploadError"
            :on-success="uploadSucceed"
            :data="upData"
            multiple
            :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button v-if="serverForm.opt === 'upload'" type="success" @click="submitUpload">上传到服务器</el-button>
          <el-button v-else type="success" @click="downloadFile">下载该文件</el-button>
          <el-button @click="fileDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Files",
    data() {
      return {
        fileList: [],
        uploadUrl: this.$api.uploadFilesURL(),
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        //服务器列表
        serversList: [],
        fileDialogVisible: false,
        serverForm: {},
        serverFormRules: {
          ip: [{required: true, message: '请输入IP', trigger: 'blur'}],
          port: [{required: true, message: '请输入端口', trigger: 'blur'}],
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          path: [{required: true, message: '请输入文件路径', trigger: 'blur'}],
        },
        uploadArgs: {}
      }
    },
    created() {
      this.getServersList()
    },
    computed: {
      //上传的额外参数
      upData: function () {
        let uploadForm = {
          'ip': this.serverForm.ip,
          'port': this.serverForm.port,
          'username': this.serverForm.username,
          'password': this.serverForm.password,
          'path': this.serverForm.path
        };
        return {
          args: JSON.stringify(uploadForm)
        }
      }
    },
    methods: {
      //文件上传
      submitUpload() {
        this.$refs.serverFormRef.validate(valid => {
          if (!valid) return;
          this.$refs.upload.submit();
        })
      },
      downloadFile() {

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      uploadError(err, file, fileList) {
        this.$message.error('上传失败!请检查路径和密码是否有误.');
        console.log(err);
      },
      uploadSucceed(response, file, fileList) {
        if (response.status === 200) {
          this.$message.success(response.message)
        } else {
          return this.$message.error(response.message)
        }
      },
      //获取服务器列表
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
        this.getServersList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getServersList()
      },
      //显示文件上传对话框
      showUploadDialog(id) {
        this.serverForm = this.serversList.find(function (obj) {
          return obj.id === id
        });
        this.serverForm['opt'] = 'upload';
        this.fileDialogVisible = true
      },
      //显示文件下载对话框
      showDownloadDialog(id) {
        this.serverForm = this.serversList.find(function (obj) {
          return obj.id === id
        });
        this.serverForm['opt'] = 'download';
        this.fileDialogVisible = true
      },
      //文件对话框关闭
      FileDialogClosed() {
        this.$refs.upload.clearFiles();
        this.$refs.serverFormRef.resetFields()
      },
    }
  }
</script>

<style scoped>

</style>
