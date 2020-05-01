<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <el-col>
                <template v-for="item in scope.row.permissions">
                  <el-tag v-if="item.action==='add'"
                          @close="removeRightById(scope.row, item.id)"
                          :closable="scope.row.name !== '管理员'">{{ item.name }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='delete'"
                          type="danger"
                          @close="removeRightById(scope.row, item.id)"
                          :closable="scope.row.name !== '管理员'">{{ item.name }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='edit'"
                          type="warning"
                          @close="removeRightById(scope.row, item.id)"
                          :closable="scope.row.name !== '管理员'">{{ item.name }}
                  </el-tag>
                  <el-tag v-else-if="item.action==='list'"
                          type="success"
                          @close="removeRightById(scope.row, item.id)"
                          :closable="scope.row.name !== '管理员'">{{ item.name }}
                  </el-tag>
                  <el-tag v-else type="info"
                          @close="removeRightById(scope.row, item.id)"
                          :closable="scope.row.name !== '管理员'">{{ item.name }}
                  </el-tag>
                </template>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="name" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="desc" align="center"></el-table-column>
        <el-table-column label="操作" width="400px" align="center">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="showEditDialog(scope.row.id)"
                       :disabled="scope.row.name === '管理员'"
                       size="mini">编辑
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       @click="removeRoleById(scope.row.id)"
                       :disabled="scope.row.name === '管理员'"
                       size="mini">删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              :disabled="scope.row.name === '管理员'"
              @click="showSetRights(scope.row)">
              分配权限
            </el-button>
            <el-button
              type="info"
              icon="el-icon-setting"
              size="mini"
              :disabled="scope.row.name === '管理员'"
              @click="showSetMenu(scope.row)">
              分配菜单
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
    <!--分配权限-->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%">
      <el-tree
        :data="rightsTree"
        :props="rightsProps"
        ref="rightsRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultRights"></el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button @click="rightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleRights">确 定</el-button>
            </span>
    </el-dialog>
    <!--分配菜单-->
    <el-dialog
      title="分配菜单"
      :visible.sync="menuDialogVisible"
      width="50%">
      <el-tree
        :data="menusTree"
        :props="rightsProps"
        ref="menusRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultMenus"></el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
            </span>
    </el-dialog>
    <!--添加角色区域-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addUserFormRef"
        label-width="70px">
        <el-form-item label="角色">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addRoleForm.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="70px">
        <el-form-item label="角色">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editRoleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        //总条目
        total: 0,
        //角色列表
        rolesList: [],
        //更新的权限
        updateRights: [],
        //分配权限会话框
        rightsDialogVisible: false,
        //选中的权限ID
        selectRightsId: [],
        defaultRights: [],
        //权限分配树形列表
        rightsTree: [],
        defaultMenus: [],
        menusTree: [],
        menuDialogVisible: false,
        //显示规则
        rightsProps: {
          children: 'children',
          label: 'name'
        },
        //添加角色对话框
        addDialogVisible: false,
        // 用户添加
        addRoleForm: {
          name: '',
          desc: ''
        },
        // 修改角色
        editDialogVisible: false,
        editRoleForm: {},
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取角色列表
      getRolesList() {
        this.$api.Rights.rolesGet(this.queryInfo).then(res => {
          this.rolesList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getRolesList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getRolesList()
      },
      //获取数组内元素索引
      indexArray(val, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === val) return i;
        }
        return -1;
      },
      //删除数组中指定元素
      removeArray(val, array) {
        let index = this.indexArray(val, array);
        if (index > -1) {
          array.splice(index, 1);
        }
      },
      //删除权限
      async removeRightById(role, rightId) {
        const rightConfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (rightConfirm !== 'confirm') {
          return this.$message.info("已取消删除")
        }
        role.permissions.forEach(value => this.updateRights.push(value.id));
        this.removeArray(rightId, this.updateRights);
        this.$api.Rights.rolesPut(role.id, {
          permissions: this.updateRights,
        }).then(res => {
          // console.log(res);
          this.$message.success("删除成功");
          this.getRolesList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
        this.updateRights = [];
      },
      //显示分配权限对话框
      showSetRights(role) {
        this.currentRole = role;
        this.$api.Rights.rightTreeGet().then(res => {
          this.rightsTree = res.data;
          console.log(this.rightsTree)
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
        //获取默认的权限
        this.defaultRights = [];
        role.permissions.forEach(value => this.getLeafkeys(value, this.defaultRights));
        this.rightsDialogVisible = true;
      },
      showSetMenu(role) {
        this.currentRole = role;
        this.$api.Rights.menuTree().then(res => {
          this.menusTree = res.data;
          console.log(this.menusTree)
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
        this.defaultMenus = [];
        role.menus.forEach(value => this.getLeafkeys(value, this.defaultMenus));
        this.menuDialogVisible = true;
      },
      getLeafkeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafkeys(item, arr))
      },
      saveRoleMenu() {
        const menusKeys = [
          ...this.$refs.menusRef.getCheckedKeys(),
          ...this.$refs.menusRef.getHalfCheckedKeys()
        ];
        this.$api.Rights.rolesPut(this.currentRole.id, {
          menus: menusKeys,
          name: this.currentRole.name
        }).then(res => {
          this.$message.success("分配成功");
          this.getRolesList()
        }).catch(err => {
          console.log(err.response.data);
          return this.$message.error(err.response.data.detail)
        });
        this.menuDialogVisible = false;
      },
      //保持修改的权限
      saveRoleRights() {
        const permissionsKeys = [
          ...this.$refs.rightsRef.getCheckedKeys(),
          ...this.$refs.rightsRef.getHalfCheckedKeys()
        ];
        this.$api.Rights.rolesPut(this.currentRole.id, {
          permissions: permissionsKeys,
          name: this.currentRole.name
        }).then(res => {
          // console.log(res);
          this.$message.success("分配成功");
          this.getRolesList()
        }).catch(err => {
          console.log(err.response.data);
          return this.$message.error(err.response.data.detail)
        });
        this.rightsDialogVisible = false;
      },
      //添加角色
      addRole() {
        // 提交请求前，表单预验证
        this.$refs.addUserFormRef.validate(valid => {
          // 表单预校验失败
          if (!valid) return;
          this.$api.Rights.rolesPot(this.addRoleForm).then(res => {
            this.$message.success('添加角色成功！');
            this.getRolesList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          // 隐藏添加角色对话框
          this.addDialogVisible = false;
        })
      },
      //关闭添加角色对话框
      addDialogClosed() {
        this.addRoleForm.name = '';
        this.addRoleForm.desc = '';
      },
      // 显示编辑角色信息对话框
      showEditDialog(id) {
        this.editRoleForm = this.rolesList.find(function (obj) {
          return obj.id === id
        });
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editRoleFormRef.resetFields()
      },
      // 修改用户信息
      editRole() {
        // 提交请求前，表单预验证
        this.$refs.editRoleFormRef.validate(valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return;
          this.$api.Rights.rolesPut(this.editRoleForm.id, {
            name: this.editRoleForm.name,
            desc: this.editRoleForm.desc
          }).then(res => {
            this.$message.success('更新角色信息成功！');
            this.getRolesList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          this.editDialogVisible = false;
        })
      },
      // 删除角色
      async removeRoleById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该角色, 是否继续?',
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
        this.$api.Rights.rolesDelete(id).then(res => {
          this.$message.success('删除角色成功！');
          this.getRolesList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
</style>
