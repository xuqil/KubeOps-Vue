<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!-- 添加权限按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加权限</el-button>
        </el-col>
      </el-row>
      <!--权限表格-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="name" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限动作" prop="method" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method === 'POST'">添加</el-tag>
            <el-tag type="danger" v-else-if="scope.row.method === 'DELETE'">删除</el-tag>
            <el-tag type="warning" v-else-if="scope.row.method === 'PUT'">编辑</el-tag>
            <el-tag type="success" v-else-if="scope.row.method === 'GET'">查看</el-tag>
            <el-tag type="info" v-else>全部</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上级权限" prop="pid" align="center">
          <template slot-scope="scope">
            <template v-if="parentRight(scope.row.pid)">{{parentRight(scope.row.pid)}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       :disabled="scope.row.path === '.*'"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       :disabled="scope.row.path === '.*'"
                       @click="removeRightsById(scope.row.id)"></el-button>
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
    <!--添加权限区域-->
    <el-dialog
      title="添加权限"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addRightsForm"
        ref="addRightsFormRef"
        label-width="90px"
        :rules="addRightsRules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="addRightsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="URL路径" prop="path" label-width="90px">
          <el-select v-model="addRightsForm.path"
                     filterable
                     allow-create
                     clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in rightPath"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="tip_message">如果是父级权限可不选填</div>
        </el-form-item>
        <el-form-item label="动作" prop="method" label-width="90px">
          <el-select v-model="addRightsForm.method" placeholder="请选择动作" clearable>
            <el-option label="增" value="POST"></el-option>
            <el-option label="删" value="DELETE"></el-option>
            <el-option label="改" value="PUT"></el-option>
            <el-option label="查" value="GET"></el-option>
            <el-option label="全部" value="*"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级权限" prop="pid" label-width="90px">
          <el-select v-model="addRightsForm.pid" placeholder="请选择" clearable filterable>
            <el-option :label="item.name" :value="item.id" v-for="item in rightsAllList" :key="item.id"></el-option>
          </el-select>
          <div class="tip_message">最多三级</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改权限的对话框 -->
    <el-dialog
      title="修改权限信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="editRightsForm"
        ref="editRightsFormRef"
        :rules="editRightsFormRules"
        label-width="70px">
        <el-form-item label="权限" prop="name" label-width="90px">
          <el-input v-model="editRightsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path" label-width="90px">
          <el-select v-model="editRightsForm.path"
                     filterable
                     allow-create
                     clearable placeholder="请选择(如果是父级权限可不选填)">
            <el-option
              v-for="(item, index) in rightPath"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="tip_message">如果是父级权限可不选填</div>
        </el-form-item>
        <el-form-item label="动作" prop="method" label-width="90px">
          <el-select v-model="editRightsForm.method" placeholder="请选择动作" clearable>
            <el-option label="增" value="POST"></el-option>
            <el-option label="删" value="DELETE"></el-option>
            <el-option label="改" value="PUT"></el-option>
            <el-option label="查" value="GET"></el-option>
            <el-option label="全部" value="*"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级权限" prop="pid" label-width="90px">
          <el-select v-model="editRightsForm.pid" placeholder="请选择" clearable filterable>
            <el-option :label="item.name" :value="item.id" v-for="item in rightsAllList" :key="item.id"></el-option>
          </el-select>
          <div class="tip_message">最多三级</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      // 自定义URL路径规则
      const checkPath = (rule, value, callback) => {
        const regPath = /^\/.*?\/$/;
        if (regPath.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法路径!如：/users/'))
      };
      return {
        // 权限列表
        rightsList: [],
        rightsAllList: [],
        queryInfo: {
          page: 1,
          page_size: 10
        },
        //总条目
        total: 0,
        //添加权限对话框闭合
        addDialogVisible: false,
        //权限表单
        addRightsForm: {
          name: '',
          path: '/abc/',
          method: '',
          pid: null
        },
        addRightsRules: {
          name: [
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          path: [
            {required: false, message: '请输入路径', trigger: 'blur'},
            {validator: checkPath, trigger: 'blur'}
          ],
          method: [
            {required: true, message: '请输入动作', trigger: 'blur'}
          ],
        },
        //编辑权限
        editDialogVisible: false,
        //编辑的权限表单
        editRightsForm: {},
        rightPath: [],
        editRightsFormRules: {
          name: [
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          path: [
            {required: false, message: '请输入路径', trigger: 'blur'},
            {validator: checkPath, trigger: 'blur'}
          ],
          method: [
            {required: true, message: '请输入动作', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getRightsList();
      this.getPath();
      this.getALlRightsList();
    },
    methods: {
      //获取权限列表
      getRightsList() {
        this.$api.Rights.rightsGet(this.queryInfo).then(res => {
          // console.log(res.data.results);
          this.rightsList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取上级权限
      parentRight(id) {
        let parent = this.rightsAllList.find(function (obj) {
          return obj.id === id
        });
        if (parent) {
          return parent.name
        }
        return null
      },
      //获取所有权限
      getALlRightsList() {
        this.$api.Rights.rightAllGet().then(res => {
          this.rightsAllList = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getRightsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getRightsList()
      },
      //添加权限对话框关闭
      addDialogClosed() {
        this.$refs.addRightsFormRef.resetFields()
      },
      //添加权限
      addRight() {
        // 提交请求前，表单预验证
        this.$refs.addRightsFormRef.validate(valid => {
          // 表单预校验失败
          if (!valid) return;
          this.$api.Rights.rightsPot(this.addRightsForm).then(res => {
            this.$message.success('添加权限成功！');
            this.getRightsList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.addDialogVisible = false;
        })
      },
      //显示编辑权限对话框
      showEditDialog(id) {
        this.editRightsForm = this.rightsList.find(function (obj) {
          return obj.id === id
        });
        this.editDialogVisible = true
      },
      getPath() {
        this.$api.Rights.pathGet().then(res => {
          this.rightPath = res.data.path
        }).catch(err => {
          return this.$message.error(err.response.data.msg)
        });
      },
      //编辑权限
      editRights() {
        // 提交请求前，表单预验证
        this.$refs.editRightsFormRef.validate(valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return;
          this.$api.Rights.rightsPut(this.editRightsForm.id, {
            name: this.editRightsForm.name,
            path: this.editRightsForm.path,
            method: this.editRightsForm.method,
            pid: this.editRightsForm.pid
          }).then(res => {
            this.$message.success('更新权限信息成功！');
            this.getRightsList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.editDialogVisible = false;
        })
      },
      //编辑权限对话框关闭
      editDialogClosed() {
        this.$refs.editRightsFormRef.resetFields()
      },
      //删除权限
      async removeRightsById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该权限, 是否继续?',
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
        this.$api.Rights.rightsDelete(id).then(res => {
          this.$message.success('删除权限成功！');
          this.getRightsList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
    }
  }
</script>

<style scoped>
  .el-select, .el-input {
    width: 50%;
  }
</style>
