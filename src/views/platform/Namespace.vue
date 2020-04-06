<template>
  <div>
    <el-row :gutter="20" v-for="(item, index) in namespaceList">
      <el-col>{{item}}</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "Namespace",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        namespaceList: '',
      }
    },
    created() {
      this.getNamespaceList(this.queryInfo);
    },
    mounted() {
      setTimeout(() => {
        this.getOrderNumber()
      }, 1000)
    },
    methods: {
      //获取Pod列表
      getNamespaceList() {
        this.$api.namespacesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.namespaceList = res.data.results;
            console.log(this.namespaceList)
          } else {
            return Promise.reject(res)
          }
        }).catch(err => {
          if (err.data.status === 400) {
            return this.$message.error(err.data.msg)
          } else {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 30px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15)
  }

  .el-col {
    font-size: 30px;
  }
</style>
