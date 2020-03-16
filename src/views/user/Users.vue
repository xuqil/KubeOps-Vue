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
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
                  用户列表区
      <el-table :data="userList" border stripe>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="roles"></el-table-column>
        <el-table-column label="状态" prop="active"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "User",
    data(){
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        userList: [],
        total: 0
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
       getUserList(){
       this.$api.users(this.queryInfo).then( res => {
         this.userList = res.data.results;
         console.log(this.userList);
         this.total = res.data.count;
       }).catch( onerror => {
         console.log(onerror);
         return this.$message.error('获取用户列表失败');
       })
      }
    }
  }
</script>

<style scoped>

</style>
