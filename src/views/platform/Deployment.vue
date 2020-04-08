<template>
  <div>
    <div class="other_button">
      <el-form :inline="true">
        <el-form-item prop="namespace">
          <el-select v-model="queryInfo.namespace" clearable placeholder="请选择命名空间">
            <el-option
              v-for="(item, index) in namespaceList"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fileByNamespace">筛选</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="deploymentList"
      :span-method="objectSpanMethod"
      :cell-class-name="tableCellClassName"
      @cell-mouse-leave="cellMouseLeave"
      @cell-mouse-enter="cellMouseEnter"
      :row-class-name="tableRowClassName"
      border>
      <el-table-column
        prop="namespace"
        label="命名空间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        label="副本">
        <template slot-scope="scope">
          <span v-if="scope.row.replicas === null">0</span>
          <span v-else>{{scope.row.replicas}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="可用副本">
        <template slot-scope="scope">
          <span v-if="scope.row.available_replicas === null">0</span>
          <span v-else>{{scope.row.available_replicas}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已就绪的副本">
        <template slot-scope="scope">
          <span v-if="scope.row.ready_replicas === null">0</span>
          <span v-else>{{scope.row.ready_replicas}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unavailable_replicas"
        label="不可用副本">
        <template slot-scope="scope">
          <span v-if="scope.row.unavailable_replicas === null">0</span>
          <span v-else>{{scope.row.unavailable_replicas}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_replicas"
        label="已更新的副本">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="readDeployment(scope.row)">查看
          </el-button>
          <el-button
            :disabled="scope.row.namespace === 'kube-system'"
            size="mini"
            type="danger"
            @click="deleteDeployment(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--详细信息-->
    <el-dialog
      title="详细信息"
      :visible.sync="detailDialogVisible"
      width="60%"
      @close="handleClose">
      <span>{{deploymentInfo}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Deployment",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5,
          //命名空间
          namespace: null
        },
        total: 0,
        deploymentList: '',
        rowIndex: '-1',
        orderIndexArr: [],
        hoverOrderArr: [],
        //筛选
        selectedNamespace: '',
        namespaceList: '',
        //deployment信息
        deploymentInfo: '',
        detailDialogVisible: false
      }
    },
    created() {
      this.getDeploymentList(this.queryInfo);
      this.getNamespaceList();
    },
    mounted() {
      setTimeout(() => {
        this.getOrderNumber()
      }, 1000)
    },
    methods: {
      //获取Deployment列表
      getDeploymentList() {
        this.$api.deploymentsGet(this.queryInfo).then(res => {
          // console.log(res)
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.deploymentList = res.data.results;
            this.total = res.data.count;
          }
        }).catch(err => {
          if (err.response.status === 500) {
            return this.$message.error('服务器错误!')
          } else {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
      //获取命名空间列表
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
      //筛选
      fileByNamespace() {
        this.getDeploymentList(this.queryInfo);
      },
      //详细信息
      readDeployment(row) {
        let read = {name: row.name, namespace: row.namespace};
        // console.log(read);
        this.$api.deploymentsDetail(read).then(res => {
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.deploymentInfo = res.data.results;
          }
          // console.log(this.deploymentInfo)
          this.detailDialogVisible = true;
        }).catch(err => {
          if (err.response.status === 500) {
            return this.$message.error('服务器错误!')
          } else {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
      handleClose() {
        this.deploymentInfo = '';
      },
      deleteDeployment(row) {
        console.log(row)
      },
      tableRowClassName({row, rowIndex}) {
        if (row.status === 'Running') {
          return 'success-row';
        } else if (row.status === 'Unknown') {
          return 'info-row';
        } else if (row.status === 'Pending') {
          return 'warning-row';
        } else if (row.status === 'Failed') {
          return 'danger-row';
        }
        return '';
      },
      // 获取相同编号的数组
      getOrderNumber() {
        let OrderObj = {};
        this.deploymentList.forEach((element, index) => {
          element.rowIndex = index;
          if (OrderObj[element.namespace]) {
            OrderObj[element.namespace].push(index)
          } else {
            OrderObj[element.namespace] = [];
            OrderObj[element.namespace].push(index)
          }
        });
        // 将数组长度大于1的值 存储到this.orderIndexArr（也就是需要合并的项）
        for (let k in OrderObj) {
          if (OrderObj[k].length > 1) {
            this.orderIndexArr.push(OrderObj[k])
          }
        }
      },
      // 合并单元格
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          for (let i = 0; i < this.orderIndexArr.length; i++) {
            let element = this.orderIndexArr[i];
            for (let j = 0; j < element.length; j++) {
              let item = element[j];
              if (rowIndex === item) {
                if (j === 0) {
                  return {
                    rowspan: element.length,
                    colspan: 1
                  }
                } else if (j !== 0) {
                  return {
                    rowspan: 0,
                    colspan: 0
                  }
                }
              }
            }
          }
        }
      },
      tableCellClassName({row, rowIndex}) {
        let arr = this.hoverOrderArr;
        for (let i = 0; i < arr.length; i++) {
          if (rowIndex === arr[i]) {
            return 'hovered-row'
          }
        }
      },
      cellMouseEnter(row, column, cell, event) {
        this.rowIndex = row.rowIndex;
        this.hoverOrderArr = [];
        this.orderIndexArr.forEach(element => {
          if (element.indexOf(this.rowIndex) >= 0) {
            this.hoverOrderArr = element
          }
        })
      },
      cellMouseLeave(row, column, cell, event) {
        this.rowIndex = '-1';
        this.hoverOrderArr = [];
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getDeploymentList()
        setTimeout(() => {
          this.rowIndex = '-1',
            this.orderIndexArr = [],
            this.hoverOrderArr = []
          this.getOrderNumber()
        }, 100)
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getDeploymentList()
        setTimeout(() => {
          this.rowIndex = '-1',
            this.orderIndexArr = [],
            this.hoverOrderArr = []
          this.getOrderNumber()
        }, 100)
      },
    }
  }
</script>

<style scoped>
  .other_button {
    margin-bottom: 20px
  }
</style>
