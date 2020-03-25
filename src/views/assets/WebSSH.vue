<template>
  <div>
    <div v-show="isShow">
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
        <el-form ref="otherServerFormRef" :model="otherServerForm" label-width="80px">
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
    <div id="xterm" v-show="!isShow" class="xterm"/>
  </div>
</template>

<script>
  import 'xterm/css/xterm.css'
  import {Terminal} from 'xterm'
  import {FitAddon} from 'xterm-addon-fit'
  import {AttachAddon} from 'xterm-addon-attach'

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
        //是否显示
        isShow: true,
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
    computed: {
      btoaPassword() {
        return window.btoa(this.otherServerForm.password)
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
      //获取other远程登录表单信息
      getConnectInfo() {
        let ssh_key = null;
        if (this.type === 'key') {
          console.log('key')
        }

        const connect_info1 = 'host=' + this.otherServerForm.host + '&port=' + this.otherServerForm.port
          + '&user=' + this.otherServerForm.user + '&auth=' + this.otherServerForm.type;
        const connect_info2 = '&password=' + this.btoaPassword + '&ssh_key=' + ssh_key;
        return connect_info1 + connect_info2
      },
      //获取窗口大小
      getTermSize() {
        const init_width = 9;
        const init_height = 17;

        let windows_width = document.body.clientWidth;
        let windows_height = document.body.clientHeight;

        return {
          cols: Math.floor(windows_width / init_width),
          rows: Math.floor(windows_height / init_height),
        }
      },
      //启动远程SSH
      startSSH() {
        let cols = this.getTermSize().cols;
        let rows = this.getTermSize().rows;
        let connect_info = this.getConnectInfo();
        console.log(cols);
        console.log(rows);
        console.log(connect_info)
        const term = new Terminal({
            cols: cols,
            rows: rows,
            useStyle: true,
            cursorBlink: true
          }),
          protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://',
          socketURL = protocol + '127.0.0.1:8000' + '/webssh/?' + connect_info + '&width=' + cols + '&height=' + rows;

        let sock = new WebSocket(socketURL);
        console.log(sock)
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        // 打开 websocket 连接, 打开 web 终端
        sock.addEventListener('open', function () {
          term.open(document.getElementById('xterm'));
        });
        this.isShow = false;
        // 读取服务器端发送的数据并写入 web 终端
        sock.addEventListener('message', function (recv) {
          let data = JSON.parse(recv.data);
          let message = data.message;
          let status = data.status;
          console.log("status:")
          console.log(status)
          if (status === 0) {
            term.write(message)
          } else {
            window.location.reload()
          }
        });
        /*
        * status 为 0 时, 将用户输入的数据通过 websocket 传递给后台, data 为传递的数据, 忽略 cols 和 rows 参数
        * status 为 1 时, resize pty ssh 终端大小, cols 为每行显示的最大字数, rows 为每列显示的最大字数, 忽略 data 参数
        */
        let message = {'status': 0, 'data': null, 'cols': null, 'rows': null};
        // 向服务器端发送数据
        term.onKey(function (data) {
          message['status'] = 0;
          message['data'] = data.key;
          let send_data = JSON.stringify(message);
          sock.send(send_data)
        });
        // 监听浏览器窗口, 根据浏览器窗口大小修改终端大小
        window.onresize = () => {
          return (() => {
            let cols = this.getTermSize().cols;
            let rows = this.getTermSize().rows;
            message['status'] = 1;
            message['cols'] = cols;
            message['rows'] = rows;
            let send_data = JSON.stringify(message);
            sock.send(send_data);
            term.resize(cols, rows)
          })();
        };
      },
      //启动SSH
      otherConnectServer() {
        this.startSSH()
      },
      otherConnectDialogClosed() {
          this.$refs.otherServerFormRef.resetFields()
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
      connectServer() {

      },
      stopConnect() {

      },
    }
  }
</script>

<style scoped>

</style>
