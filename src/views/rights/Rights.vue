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
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="title"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限动作" prop="action">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.action === 'add'">添加</el-tag>
            <el-tag type="danger" v-else-if="scope.row.action === 'delete'">删除</el-tag>
            <el-tag type="warning" v-else-if="scope.row.action === 'edit'">编辑</el-tag>
            <el-tag type="success" v-else-if="scope.row.action === 'list'">查看</el-tag>
            <el-tag type="info" v-else>Admin</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        // 权限列表
        rightsList: [],
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        //总条目
        total: 0,
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      //获取权限列表
      getRightsList() {
        this.$api.rightsGet(this.queryInfo).then(res => {
          // console.log(res.data.results);
          this.rightsList = res.data.results;
          this.total = res.data.count;
        }).catch(onerror => {
          console.log(onerror);
          return this.$message.error('获取权限列表失败！')
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
    }
  }
</script>

<style scoped>

</style>
