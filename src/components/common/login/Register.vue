<template>
  <div class="register">
    <div class="register-wrap">
      <el-row type="flex" justify="center">
        <el-form :model="registerForm" :rules="rules" status-icon ref="registerForm" label-width="100px">
          <h3>登录</h3>
          <div class="user-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="registerForm.checkPassword" placeholder="请再次输入密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="user-sbn" type="primary" style="width: 100px" @click="doRegister('registerForm')">注册
              </el-button>
              <el-button class="user-sbn" type="primary" style="width: 100px" @click="login">登录</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Register",
    data() {
      const checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        callback();
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerForm.checkPassword !== '') {
            this.$refs.registerForm.validateField('checkPassword');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          password: '',
          checkPassword: '',
          username: ''
        },
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          username: [
            {validator: checkUsername, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      doRegister(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.$api.Users.register(this.registerForm).then(res => {
              console.log(res);
              this.$message.success("注册成功")
            }).catch(err => {
              console.log(err);
              return this.$message.error(err.response.data.detail)
            });
          } else {
            console.log('注册失败!!');
            return false;
          }
        });
      },
      login() {
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>
  .register {
    width: 100%;
    height: 740px;
    background: #aaaaaa;
    background-size: cover;
    overflow: hidden;
  }

  .register-wrap {
    background-size: cover;
    background: #dadada;
    border: 1px solid #dadada;
    width: 400px;
    height: 300px;
    margin: 215px auto;
    overflow: hidden;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 0 5px 10px #dadada;
  }

  .user-form {
    margin-right: 60px;
  }

  h3 {
    color: #0babeab8;
    font-size: 24px;
  }

  a {
    text-decoration: none;
    color: #aaa;
    font-size: 15px;
    margin-left: 90px;
  }

  a:hover {
    color: coral;
  }

  .user-sbn {
    float: left
  }
</style>
