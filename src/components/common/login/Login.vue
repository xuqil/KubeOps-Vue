<template>
  <div class="login_container">
    <div class="login_box">
      <!--  标题  -->
      <div class="title_box">
        KubeOps运维平台
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          label-width="60px"
          class="login_form"
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef">
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"
                      prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: 'admin'
        },
        // 表单验证
        loginFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //重置表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      //登录及表单校验
      login() {
        this.$refs.loginFormRef.validate(valid => {
          // console.log(valid);
          if (!valid) return false;
          this.$api.login(this.loginForm).then(res => {
            console.log(res.data);
            this.$store.commit('saveUsername', res.data.username);
            this.$store.commit('saveUserId', res.data.id)
            if (res.data.status !== 200) return this.$message.error("登录失败");
            this.$message.success("登录成功");
            //保持token
            let token = res.data.token;
            window.sessionStorage.setItem('token', token);
            // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
            this.$router.push('/home')
          }).catch(err => {
            console.log(err);
            return false;
          })

        })
      }
    }
  }
</script>

<style scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 350px;
    background-color: #ffffff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
  }

  /*使用flex的justify-content对自身元素居中布局*/
  .title_box {
    font-size: 22px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    padding-top: 15px;
  }

  .login_form {
    position: absolute;
    bottom: 40px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    padding-top: 20px;
    padding-right: 15px;
    display: flex;
    justify-content: center;
  }
</style>
