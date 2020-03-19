<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
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
          <el-button class="update_button" type="primary" @click="updateUser">修改</el-button>
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
        }
      };
    },
    created() {
      this.getUserDetail()
    },
    methods: {
      getUserDetail() {
        this.$api.userDetail(this.$store.getters.getUserId).then(res => {
          console.log(res);
          this.userForm = res.data;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error("获取用户信息失败")
        })
      },
      updateUser() {
        // 提交请求前，表单预验证
        this.$refs.userFormRef.validate(valid => {
          // 表单预校验失败
          if (!valid) return;
          this.$api.userUpdate(this.userForm.id, this.userForm).then(res => {
            this.$message.success('修改成功！');
            this.getUserDetail()
          }).catch(onerror => {
            console.log(onerror);
            this.$message.error('修改失败！用户名可能重复')
          });
        })
      },
    }
  };
</script>

<style>
  .el-form-item {
    width: 50%;
  }

  .update_button {
    float: right;
  }
</style>
