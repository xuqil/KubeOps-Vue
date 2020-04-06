<template>
  <div>
    <el-table
      :data="nodeList"
      border>
      <el-table-column
        prop="hostname"
        label="节点名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="host"
        label="节点IP">
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>CPU: {{ scope.row.capacity.cpu }}</p>
            <p>内存: {{ scope.row.capacity.memory }}</p>
            <p>Pod数量: {{ scope.row.capacity.pods }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">主机的资源</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>CPU: {{ scope.row.allocatable.cpu }}</p>
            <p>内存: {{ scope.row.allocatable.memory }}</p>
            <p>Pod数量: {{ scope.row.allocatable.pods }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">可分配的资源</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Node",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        nodeList: '',
      }
    },
    created() {
      this.getNodeList(this.queryInfo);
    },
    mounted() {
      setTimeout(() => {
        this.getOrderNumber()
      }, 100)
    },
    methods: {
      //获取Node列表
      getNodeList() {
        this.$api.nodesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.nodeList = res.data.results;
            console.log('============')
            console.log(this.nodeList)
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

</style>
