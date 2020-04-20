<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <p>用户基本信息修改</p>
      <el-form
        :model="userForm"
        status-icon
        :rules="userFormRules"
        ref="userFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="update_button" @click="resetForm('userFormRef')">重置</el-button>
          <el-button class="update_button" type="primary" @click="updateUser">修改</el-button>
        </el-form-item>
      </el-form>
      <p>用户密码修改</p>
      <el-form :model="updatePasswordForm"
               :rules="updatePasswordFormRules"
               ref="updatePasswordFormRef"
               label-width="100px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input type="password" v-model="updatePasswordForm.old_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="updatePasswordForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="updatePasswordForm.checkPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="update_button" @click="resetForm('updatePasswordFormRef')">重置</el-button>
          <el-button class="update_button" type="primary" @click="updatePassword">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
          return callback();
        }
        callback(new Error("请输入合法邮箱"));
      };
      // 自定义手机号规则
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/;
        if (regMobile.test(value)) {
          return callback();
        }
        // 返回一个错误提示
        callback(new Error("请输入合法的手机号码"));
      };

      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.updatePasswordForm.checkPassword !== '') {
            this.$refs.updatePasswordFormRef.validateField('checkPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.updatePasswordForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userForm: {
          username: "",
          email: "",
          mobile: ""
        },
        userFormRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {
              min: 2,
              max: 10,
              message: "用户名的长度在2～10个字",
              trigger: "blur"
            }
          ],
          email: [
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {validator: checkEmail, trigger: "blur"}
          ],
          mobile: [
            {required: true, message: "请输入手机号码", trigger: "blur"},
            {validator: checkMobile, trigger: "blur"}
          ]
        },

        updatePasswordForm: {
          old_password: '',
          password: '',
          checkPassword: ''
        },
        updatePasswordFormRules: {
          old_password: [
            {required: true, message: '请输入旧的密码', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {required: true, message: '请再次输入用户密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.getUserDetail()
    },
    methods: {
      getUserDetail() {
        this.$api.Users.userDetail(this.$store.getters.getUserId).then(res => {
          console.log(res);
          this.userForm = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //更新用户基本信息
      updateUser() {
        // 提交请求前，表单预验证
        this.$refs.userFormRef.validate(valid => {
          // 表单预校验失败
          if (!valid) return;
          this.$api.Users.userUpdate(this.userForm.id, this.userForm).then(res => {
            this.$message.success('修改成功！');
            this.getUserDetail()
          }).catch(onerror => {
            console.log(onerror);
            this.$message.error('修改失败！用户名可能重复')
          });
        })
      },
      //更新用户密码
      updatePassword() {
        this.$refs.updatePasswordFormRef.validate((valid) => {
          if (!valid) return;
          this.$api.Users.passwordUpdate(this.updatePasswordForm).then(res => {
            this.$message.success('修改成功！');
            window.sessionStorage.clear();
            this.$router.push('/login')
          }).catch(onerror => {
            console.log(onerror);
            this.$message.error('修改失败！密码可能错误')
          });
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style>
  .el-form-item {
    width: 50%;
  }

  .update_button {
    float: right;
    margin-left: 10px;
  }
</style>
