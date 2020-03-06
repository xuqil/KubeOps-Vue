<template>
  <div class="login">
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" label-width="100px">
          <h3>登录</h3>
          <div class="user-form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <router-link to="/">找回密码</router-link>
            <router-link to="/register">注册账号</router-link>
            <el-form-item>
              <el-button class="user-sbn" type="primary" style="width: 100%" @click="doLogin('ruleForm')">登录
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import {login} from 'network/loginRegister'

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{required: true, message: '请输入用户名或账号', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        }
      }
    },
    methods: {
      doLogin() {
        login(this.loginForm).then(res => {
          console.log(res);
          this.$message.success("登录成功")
        }).catch( error => {
          console.log(error);
          this.$message.error("用户或者密码错误")
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    width: 100%;
    height: 740px;
    /*background: url("~assets/img/login/4.jpg") no-repeat;*/
    background: #aaaaaa;
    background-size: cover;
    overflow: hidden;
  }

  .login-wrap {
    /*background: url("~assets/img/login/3.jpg") no-repeat;*/
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
