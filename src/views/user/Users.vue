<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <!--            搜索与添加区域-->
      <el-row :gutter="20">
        <!--        <el-col :span="8">-->
        <!--          <el-input placeholder="请输入内容">-->
        <!--            <el-button slot="append" icon="el-icon-search"></el-button>-->
        <!--          </el-input>-->
        <!--        </el-col>-->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"  align="center"></el-table-column>
        <el-table-column label="姓名" prop="username"  align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email"  align="center"></el-table-column>
        <el-table-column label="电话" prop="mobile"  align="center"></el-table-column>
        <el-table-column label="角色" prop="roles[0].name"  align="center">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.roles" effect="plain" size="mini">{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否为管理员" prop="is_staff" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_staff"
                       @change="userStaffChange(scope.row)"
                       :disabled="scope.row.username === 'admin'">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active"
                       @change="userActiveChange(scope.row)"
                       :disabled="scope.row.username === 'admin'">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date_joined"  align="center">
          <template slot-scope="scope">{{scope.row.date_joined | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="上次登录时间" prop="last_login"  align="center">
          <template slot-scope="scope" v-if="scope.row.last_login">{{scope.row.last_login | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(scope.row.id)"
                       :disabled="scope.row.username === 'admin'"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"
                       :disabled="scope.row.username === 'admin'"></el-button>
            <el-tooltip effect="dark" content="分配角色"
                        placement="top"
                        :enterable="false"
                        :disabled="scope.row.username === 'admin'">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                         @click="showSetRole(scope.row)"
                         :disabled="scope.row.username === 'admin'"></el-button>
            </el-tooltip>
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
    <!--对话框区域-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="addUserForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色-->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
      <p>当前用户：{{userInfo.username}}</p>
      <div class="roles_container">当前角色：
        <span v-if="userInfo.roles.length > 1" v-for="(role, index) in userInfo.roles" :key="index"
              :class="index === userInfo.roles.length-1 ? '' : 'last_role'">{{role.name}}</span>
        <span v-else v-for="role in userInfo.roles">{{role.name}}</span>
      </div>
      分配角色：
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      // 自定义邮箱规则
      const checkEmail = (rule, value, callback) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/;
        if (regEmail.test(value)) {
          // 合法邮箱
          return callback()
        }
        callback(new Error('请输入合法邮箱'))
      };
      // 自定义手机号规则
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/;
        if (regMobile.test(value)) {
          return callback()
        }
        // 返回一个错误提示
        callback(new Error('请输入合法的手机号码'))
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addUserForm.checkPassword !== '') {
            this.$refs.addUserFormRef.validateField('checkPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addUserForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        userList: [],
        total: 0,
        //对话框
        addDialogVisible: false,
        // 用户添加
        addUserForm: {
          username: '',
          password: '',
          checkPassword: '',
          email: '',
          mobile: ''
        },
        // 用户添加表单验证规则
        addUserFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              min: 2,
              max: 10,
              message: '用户名的长度在2～10个字',
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {required: true, message: '请再次输入用户密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        // 修改用户
        editDialogVisible: false,
        editUserForm: {},
        // 编辑用户表单验证
        editUserFormRules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        //是否显示分配角色对话框
        roleDialogVisible: false,
        //分配角色的用户信息
        userInfo: {},
        //所有角色
        rolesList: [],
        //已选中的角色
        selectRoleId: []
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.$api.Users.usersGet(this.queryInfo).then(res => {
          this.userList = res.data.results;
          console.log(this.userList);
          this.total = res.data.count;
        }).catch(onerror => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getUserList()
      },
      userStaffChange(userInfo) {
        console.log(userInfo);
        this.$api.Users.usersPut(
          userInfo.id,
          {'is_staff': userInfo.is_staff, 'username': userInfo.username}
        ).then(res => {
          this.$message.success("更新成功")
        }).catch(err => {
          return this.$message.error(err.response.data.detail)
        });
      },
      //    更新用户状态
      userActiveChange(userInfo) {
        console.log(userInfo);
        this.$api.Users.usersPut(
          userInfo.id,
          {'is_active': userInfo.is_active, 'username': userInfo.username}
        ).then(res => {
          this.$message.success("更新用户状态成功")
        }).catch(err => {
          return this.$message.error(err.response.data.detail)
        });
      },
      //监听 添加用户添加提示框关闭事件，关闭则清空表单
      addDialogClosed() {
        this.$refs.addUserFormRef.resetFields()
      },
      // 添加用户
      addUser() {
        // 提交请求前，表单预验证
        this.$refs.addUserFormRef.validate(valid => {
          // 表单预校验失败
          if (!valid) return;
          this.$api.Users.userAdd(this.addUserForm).then(res => {
            this.$message.success('添加用户成功！');
            this.getUserList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          // 隐藏添加用户对话框
          this.addDialogVisible = false;
        })
      },
      // 编辑用户信息
      showEditDialog(id) {
        this.editUserForm = this.userList.find(function (obj) {
          return obj.id === id
        });
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editUserFormRef.resetFields()
      },
      // 修改用户信息
      editUser() {
        // 提交请求前，表单预验证
        this.$refs.editUserFormRef.validate(valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return;
          this.$api.Users.usersPut(this.editUserForm.id, {
            username: this.editUserForm.username,
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }).then(res => {
            this.$message.success('更新用户信息成功！');
            this.getUserList()
          }).catch(err => {
            console.log(err);
            return this.$message.error(err.response.data.detail)
          });
          // 隐藏添加用户对话框
          this.editDialogVisible = false;
        })
      },
      // 删除用户
      async removeUserById(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        // 点击确定 返回值为：confirm
        // 点击取消 返回值为： cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        this.$api.Users.userDelete(id).then(res => {
          this.$message.success('删除用户成功！');
          this.getUserList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },

      //展示分配角色
      showSetRole(role) {
        this.userInfo = role;
        // 展示对话框之前，获取所有角色列表
        this.$api.Rights.rolesGet().then(res => {
          console.log(res.data.results);
          this.rolesList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
        this.roleDialogVisible = true
      },
      // 分配角色
      saveRoleInfo() {
        if (!this.selectRoleId) {
          return this.$message.error('请选择要分配的角色')
        }
        this.$api.Users.usersPut(this.userInfo.id, {roles: this.selectRoleId}).then(res => {
          console.log(res);
          this.$message.success('更新角色成功！');
          this.getUserList();
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
        this.roleDialogVisible = false
      },
      // 分配角色对话框关闭事件
      setRoleDialogClosed() {
        this.selectRoleId = '';
        this.userInfo = {};
      }
    }
  }
</script>

<style scoped>
  /*角色列表样式*/
  .roles_container {
    padding-bottom: 5px;
  }

  .last_role {
    display: inline-block;
    padding-right: 5px;
  }

</style>
