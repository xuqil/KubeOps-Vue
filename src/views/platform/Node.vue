<template>
  <div>
    <el-table
      :data="nodeList"
      :header-cell-style="getTableHeaderStyle"
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
      <el-table-column label="主机资源">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>CPU: {{ scope.row.capacity.cpu }}</p>
            <p>内存: {{ scope.row.capacity.memory }}</p>
            <p>Pod数量: {{ scope.row.capacity.pods }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">主机资源</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="可分配的资源">
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
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Ready'" type="primary" disable-transitions>{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.status === 'True'" type="primary" disable-transitions>{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status === 'Error'" type="danger" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'Unknown'" type="info" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else type="danger" disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Node",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        total: 0,
        nodeList: '',
      }
    },
    created() {
      this.getNodeList(this.queryInfo);
    },
    computed: {
      ...mapGetters([
        'getTableHeaderStyle'
      ]),
    },
    methods: {
      //获取Node列表
      getNodeList() {
        this.$api.K8S.nodesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.nodeList = res.data.results;
          } else {
            return Promise.reject(res)
          }
        }).catch(err => {
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
