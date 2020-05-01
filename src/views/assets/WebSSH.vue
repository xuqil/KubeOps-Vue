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
        <el-table :data="serversList" stripe @sort-change="sortChange" :header-cell-style="getTableHeaderStyle">
          <el-table-column type="index" label="#" align="center"></el-table-column>
          <el-table-column label="主机名" prop="hostname" align="center" sortable="custom"></el-table-column>
          <el-table-column label="IP" prop="ip" align="center" sortable="custom"></el-table-column>
          <el-table-column label="设备类型" prop="device_type" align="center" sortable="custom"></el-table-column>
          <el-table-column label="操作系统版本" prop="os_version" align="center" sortable="custom"></el-table-column>
          <el-table-column label="应用环境" prop="app_env" align="center" sortable="custom"></el-table-column>
          <el-table-column label="登录用户" prop="username" align="center"></el-table-column>
          <el-table-column label="操作" width="230px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="showTableConnectServer(scope.row.id)" size="mini">远程登录
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
          :page-sizes="[5, 10, 15, 20]"
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
            <el-input v-model="otherServerForm.ip"></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="otherServerForm.port"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="otherServerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="认证类型">
            <el-radio-group v-model="otherServerForm.auth_type">
              <el-radio label="pwd" checked>密码认证</el-radio>
              <el-radio label="key">秘钥认证</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" v-if="otherServerForm.auth_type === 'pwd'">
            <el-input type="password" show-password v-model="otherServerForm.password"></el-input>
          </el-form-item>

          <el-form-item label="秘钥文件" v-else>
            <el-upload
              :action="this.$api.Assets.uploadKeyUrl()"
              :before-remove="beforeRemove"
              :before-upload="beforeKeyUpload"
              :on-success="uploadSuccess"
              :file-list="fileList"
              name="pkey">
              <el-button size="mini" type="info">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">文件大小不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="otherConnectServer">登录</el-button>
            <el-button @click="otherConnectDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!--主机列表的远程登录-->
      <el-dialog
        title="登录服务器"
        :visible.sync="tableConnectDialogVisible"
        width="50%"
        @close="tableConnectDialogClosed">
        <el-form ref="tableServerFormRef" :model="tableServerForm" label-width="80px">
          <el-form-item label="主机地址">
            <el-input v-model="tableServerForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="tableServerForm.port"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="tableServerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="认证类型">
            <el-radio-group v-model="tableServerForm.auth_type">
              <el-radio label="pwd" checked>密码认证</el-radio>
              <el-radio label="key">秘钥认证</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" v-if="tableServerForm.auth_type === 'pwd'">
            <el-input type="password" show-password v-model="tableServerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="秘钥文件" v-else>
            <el-upload
              :action="this.$api.Assets.uploadKeyUrl()"
              :before-remove="beforeRemove"
              :before-upload="beforeKeyUpload"
              :on-success="uploadSuccess"
              :file-list="fileList"
              name="pkey">
              <el-button size="mini" type="info">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">文件大小不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tableConnectServer">登录</el-button>
            <el-button @click="tableConnectDialogVisible = false">取消</el-button>
        </span>
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
  import {mapGetters} from "vuex";

  export default {
    name: "WebSSH",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10,
          ordering: null
        },
        total: 0,
        //服务器列表
        serversList: [],
        otherConnectDialogVisible: false,
        //是否显示
        isShow: true,
        //其他主机登录信息
        otherServerForm: {
          ip: '192.168.1.11',
          port: 22,
          username: 'kubeops',
          auth_type: 'pwd',
          password: 'kubeops'
        },
        ssh_key: null,
        fileList: [],
        //主机列表的主机登录信息
        tableServerForm: [],
        tableConnectDialogVisible: false,
      }
    },
    created() {
      this.getServersList()
    },
    computed: {
      ...mapGetters([
        'getTableHeaderStyle'
      ]),
    },
    methods: {
      //适配终端大小
      initXtermDiv() {
        const xtermDiv = document.getElementById('xterm');
        const clientHeight = document.body.clientHeight;
        const clientWidth = document.body.clientWidth;
        xtermDiv.style.height = (clientHeight - 70).toString() + 'px';
        xtermDiv.style.width = (clientWidth - 240).toString() + 'px';
      },
      //获取服务器列表
      getServersList() {
        this.$api.Assets.serversGet(this.queryInfo).then(res => {
          this.serversList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //排序
      sortChange(order) {
        if (order.order === 'ascending') {
          this.queryInfo.ordering = order.prop
        } else if (order.order === 'descending') {
          this.queryInfo.ordering = '-' + order.prop
        } else {
          this.queryInfo.ordering = null
        }
        this.getServersList()
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
      //获取窗口大小
      getTermSize() {
        const initWidth = 9;
        const initHeight = 17;
        const windowsWidth = document.body.clientWidth;
        const windowsHeight = document.body.clientHeight;
        return {
          cols: Math.floor(windowsWidth / initWidth),
          rows: Math.floor(windowsHeight / initHeight),
        }
      },
      //获取远程登录表单信息
      getConnectInfo(serverForm, type) {
        /*
        * serverForm: 主机表单信息
        * type: 1:其他主机远程登录   2:主机列表的主机远程登录
        * */
        const connect_info1 = 'host=' + serverForm.ip + '&port=' + serverForm.port
          + '&user=' + serverForm.username + '&auth=' + serverForm.auth_type;
        const connect_info2 = '&password=' + window.btoa(serverForm.password) + '&ssh_key=' + this.ssh_key + '&type=' + type;
        return connect_info1 + connect_info2
      },
      //启动远程SSH
      startSSH(serverForm, type) {
        let cols = this.getTermSize().cols;
        let rows = this.getTermSize().rows;
        let connectInfo = this.getConnectInfo(serverForm, type);
        console.log(cols);
        console.log(rows);
        console.log(connectInfo)
        const term = new Terminal({
            cols: cols,
            rows: rows,
            useStyle: true,
            cursorBlink: true
          }),
          protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://',
          socketURL = protocol + this.$api.Assets.websshUrl() + '?' + connectInfo + '&width=' + cols + '&height=' + rows;

        let sock = new WebSocket(socketURL);
        console.log(sock)
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        // 打开 websocket 连接, 打开 web 终端
        sock.addEventListener('open', function () {
          term.open(document.getElementById('xterm'));
        });
        this.isShow = false;
        this.initXtermDiv();
        // 读取服务器端发送的数据并写入 web 终端
        sock.addEventListener('message', function (recv) {
          let data = JSON.parse(recv.data);
          let message = data.message;
          let status = data.status;
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
        this.startSSH(this.otherServerForm, 1)
      },
      otherConnectDialogClosed() {
        this.$refs.otherServerFormRef.resetFields()
      },
      //上传秘钥文件处理
      beforeKeyUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        return isLt2M;
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      uploadSuccess(response) {
        this.ssh_key = response
      },
      //显示主机列表登录界面
      showTableConnectServer(id) {
        this.tableServerForm = this.serversList.find(function (obj) {
          return obj.id === id
        });
        //默认密码登录
        this.tableServerForm['auth_type'] = 'pwd';
        this.tableConnectDialogVisible = true
      },
      //启动SSH
      tableConnectServer() {
        this.startSSH(this.tableServerForm, 2)
      },
      tableConnectDialogClosed() {
        this.$refs.tableServerFormRef.resetFields()
      },
      stopConnect() {

      },
    }
  }
</script>

<style scoped>

</style>
