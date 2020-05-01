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
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true"
                     v-if="showAdd">添加主机
          </el-button>
          <el-button type="text"
                     icon="el-icon-back"
                     @click="onBack"
                     v-else>返回
          </el-button>
        </el-col>
        <el-col :span="20">
          <el-form :inline="true" :model="queryInfo" class="search_form">
            <el-form-item>
              <el-input v-model="queryInfo.hostname" placeholder="主机名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryInfo.os_type" placeholder="操作系统类型" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryInfo.ip" placeholder="服务器IP" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryInfo.idc" placeholder="所在机房" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSearch">筛选</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--主机列表-->
      <el-table :data="serversList" @sort-change="sortChange">
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="主机名" prop="hostname" align="center" min-width="100px" sortable="custom"></el-table-column>
        <el-table-column label="IP" prop="ip" align="center" min-width="100px" sortable="custom"></el-table-column>
        <el-table-column label="操作系统类型" prop="os_type" align="center" min-width="150px" sortable="custom"></el-table-column>
        <el-table-column label="操作系统版本" prop="os_version" align="center" min-width="150px" sortable="custom"></el-table-column>
        <el-table-column label="设备类型" prop="device_type" align="center" min-width="120px" sortable="custom"></el-table-column>
        <el-table-column label="应用环境" prop="app_env" align="center" min-width="120px" sortable="custom"></el-table-column>
        <el-table-column label="所在机房" prop="idc.name" align="center" min-width="120px" sortable="custom"></el-table-column>
        <el-table-column label="服务器状态" prop="status" align="center" min-width="120px" sortable="custom"></el-table-column>
        <el-table-column label="序列号" prop="sn" align="center" min-width="120px" sortable="custom"></el-table-column>
        <el-table-column label="上架日期" prop="shelves_date" align="center" min-width="130px" sortable="custom"></el-table-column>
        <el-table-column label="保修日期" prop="maintenance_date" align="center" min-width="130px" sortable="custom"></el-table-column>
        <el-table-column label="创建日期" prop="c_time" align="center" min-width="150px" sortable="custom">
          <template slot-scope="scope">{{scope.row.c_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="更新日期" prop="u_time" align="center" min-width="150px" sortable="custom">
          <template slot-scope="scope">{{scope.row.u_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="备注" prop="marks" align="center" min-width="200px"></el-table-column>
        <el-table-column label="操作" align="center" width="120px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeServerById(scope.row.id)" size="mini">
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
    <!--添加主机区域-->
    <el-dialog
      title="添加服务器"
      :visible.sync="addDialogVisible"
      width="70%"
      @close="addDialogClosed">
      <el-form
        :model="addServerForm"
        ref="addServerFormRef"
        :rules="addServerFormRules"
        label-width="100px">
        <el-form-item label="主机名称" prop="hostname">
          <el-input v-model="addServerForm.hostname" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器IP" prop="ip">
          <el-input v-model="addServerForm.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作系统类型">
          <el-input v-model="addServerForm.os_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作系统版本">
          <el-input v-model="addServerForm.os_version" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录类型">
          <el-input v-model="addServerForm.auth_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器用户名">
          <el-input v-model="addServerForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器密码">
          <el-input type="password" v-model="addServerForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号">
          <el-input v-model="addServerForm.port" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用环境">
          <el-input v-model="addServerForm.app_env" clearable></el-input>
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="addServerForm.sn" clearable></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="addServerForm.model" clearable></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="addServerForm.brand" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input v-model="addServerForm.device_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="addServerForm.status" clearable></el-input>
        </el-form-item>
        <el-form-item label="所在机柜">
          <el-input v-model="addServerForm.cabinet" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器类型">
          <el-input v-model="addServerForm.type" clearable></el-input>
        </el-form-item>
        <el-form-item label="上架日期">
          <el-input v-model="addServerForm.shelves_date" clearable></el-input>
        </el-form-item>
        <el-form-item label="保修日期">
          <el-input v-model="addServerForm.maintenance_date" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addServerForm.marks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addServer">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑主机区域-->
    <el-dialog
      title="编辑服务器"
      :visible.sync="editDialogVisible"
      width="70%"
      @close="editDialogClosed">
      <el-form
        :model="editServerForm"
        ref="editServerFormRef"
        :rules="addServerFormRules"
        label-width="100px">
        <el-form-item label="主机名称" prop="hostname">
          <el-input v-model="editServerForm.hostname" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器IP" prop="ip">
          <el-input v-model="editServerForm.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="机房">
          <el-select v-model="editServerForm.idc" clearable filterable placeholder="请选择机房">
            <el-option
              v-for="item in IDCList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="selectedTags" clearable filterable multiple placeholder="请选择">
            <el-option
              v-for="item in tagsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统类型">
          <el-input v-model="editServerForm.os_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="操作系统版本">
          <el-input v-model="editServerForm.os_version" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录类型">
          <el-input v-model="editServerForm.auth_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器用户名">
          <el-input v-model="editServerForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器密码">
          <el-input type="password" v-model="editServerForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器端口号">
          <el-input v-model="editServerForm.port" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用环境">
          <el-input v-model="editServerForm.app_env" clearable></el-input>
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="editServerForm.sn" clearable></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="editServerForm.model" clearable></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="editServerForm.brand" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input v-model="editServerForm.device_type" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="editServerForm.status" clearable></el-input>
        </el-form-item>
        <el-form-item label="所在机柜">
          <el-input v-model="editServerForm.cabinet" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务器类型">
          <el-input v-model="editServerForm.type" clearable></el-input>
        </el-form-item>
        <el-form-item label="上架日期">
          <el-input v-model="editServerForm.shelves_date" clearable></el-input>
        </el-form-item>
        <el-form-item label="保修日期">
          <el-input v-model="editServerForm.maintenance_date" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editServerForm.marks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editServer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Server",
    inject: ['reload'],
    data() {
      // 自定义IPV4规则
      const checkIPV4 = (rule, value, callback) => {
        const ipv4Regexp = /^(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}$/gm;
        if (ipv4Regexp.test(value)) {
          return callback()
        }
        // 返回一个错误提示
        callback(new Error('请输入合法的IPV4'))
      };
      return {
        queryInfo: {
          page: 1,
          page_size: 10,
          hostname: null,
          os_type: null,
          ip: null,
          idc: null,
          ordering: null
        },
        total: 0,
        showAdd: true,
        //服务器列表
        serversList: [],
        addDialogVisible: false,
        //添加的服务器
        addServerForm: {
          hostname: '',
          ip: '',
          os_type: '',
          os_version: '',
          auth_type: "",
          username: "",
          password: "",
          port: "",
          app_env: "",
          sn: "",
          model: "",
          brand: "",
          device_type: "",
          status: "",
          cabinet: "",
          type: "",
          shelves_date: "",
          maintenance_date: "",
          marks: ""
        },
        addServerFormRules: {
          hostname: [{required: true, message: '请输入主机名', trigger: 'blur'},],
          ip: [
            {required: true, message: '请输入IP', trigger: 'blur'},
            {validator: checkIPV4, trigger: 'blur'}
          ]
        },
        editDialogVisible: false,
        //编辑的服务器
        editServerForm: [],
        IDCList: '',
        tagsList: [],
        //已选中的标签
        selectedTags: [],
      }
    },
    created() {
      this.getServersList()
    },
    methods: {
      getServersList() {
        this.$api.Assets.serversGet(this.queryInfo).then(res => {
          this.serversList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      submitSearch() {
        this.getServersList();
        this.showAdd = false;
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
      onBack() {
        this.showAdd = true;
        this.queryInfo.hostname = null;
        this.queryInfo.os_type = null;
        this.queryInfo.ip = null;
        this.queryInfo.idc = null;
        this.queryInfo.ordering = null;
        this.reload();
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
      //删除主机
      async removeServerById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该主机, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        this.$api.Assets.serversDelete(id).then(res => {
          this.$message.success('删除主机成功！');
          this.getServersList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
      addServer() {
        this.$refs.addServerFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Assets.serversPot(this.addServerForm).then(res => {
            this.$message.success('添加主机成功！');
            this.getServersList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addDialogVisible = false;
        })
      },
      addDialogClosed() {
        Object.keys(this.addServerForm).forEach(key => this.addServerForm[key] = '');
      },
      //显示编辑主机对话框
      showEditDialog(id) {
        this.editServerForm = this.serversList.find(function (obj) {
          return obj.id === id
        });
        //判断是否分配机房
        if (this.editServerForm.idc !== null) {
          if (this.editServerForm.idc.id !== undefined) {
            //获取已分配的机房ID
            this.editServerForm.idc = this.editServerForm.idc.id;
          }
        }
        //获取已分配的标签ID
        this.selectedTags = [];
        this.editServerForm.tags.forEach(value => this.selectedTags.push(value.id));

        this.getIDCList();
        this.getTagsList();
        this.editDialogVisible = true
      },
      //提交编辑
      editServer() {
        this.$refs.editServerFormRef.validate(valid => {
          if (!valid) return;
          console.log(this.selectedTags)
          if (this.selectedTags === []) {
            let tmp = this.editServerForm.tags;
            this.editServerForm.tags = [];
            tmp.forEach(value => this.editServerForm.tags.push(value.id));
          } else {
            this.editServerForm.tags = this.selectedTags;
          }
          console.log(this.editServerForm)
          this.$api.Assets.serversPut(this.editServerForm.id, this.editServerForm).then(res => {
            this.$message.success('更新主机信息成功！');
            this.getServersList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.editDialogVisible = false;
        })
      },
      //获取IDC列表
      getIDCList() {
        this.$api.Assets.IDCGet(this.queryInfo).then(res => {
          this.IDCList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取标签列表
      getTagsList() {
        this.$api.Assets.tagsGet(this.queryInfo).then(res => {
          this.tagsList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      editDialogClosed() {
        this.$refs.editServerFormRef.resetFields()
      },
    }
  }
</script>

<style scoped>
  .search_form {
    float: right;
    margin: 0;
  }
</style>
