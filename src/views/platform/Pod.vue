<template>
  <div>
    <el-table
      :data="podList"
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
        label="IP">
        <template slot-scope="scope">
          <span v-if="scope.row.pod_ip === null">无</span>
          <span v-else>{{scope.row.pod_ip}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="节点">
        <template slot-scope="scope">
          <span v-if="scope.row.host_ip === null">无</span>
          <span v-else>{{scope.row.host_ip}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Running'" type="primary" disable-transitions>{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status === 'Succeeded'" type="success" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'Unknown'" type="info" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'Pending'" type="warning" disable-transitions>{{scope.row.status}}
          </el-tag>
          <el-tag v-else type="danger" disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editPod(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deletePod(scope.row)">删除
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
  </div>
</template>

<script>
  export default {
    name: "Pod",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        podList: '',
        rowIndex: '-1',
        orderIndexArr: [],
        hoverOrderArr: []
      }
    },
    created() {
      this.getPodList();
    },
    mounted() {
      setTimeout(() => {
        this.getOrderNumber()
      }, 1000)
    },
    methods: {
      //获取Pod列表
      getPodList() {
        this.$api.podsGet(this.queryInfo).then(res => {
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.podList = res.data.results;
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
      editPod(row) {
        console.log(row)
      },
      deletePod(row) {
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
        this.podList.forEach((element, index) => {
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
        this.getPodList()
        setTimeout(() => {
          this.rowIndex = '-1',
            this.orderIndexArr = [],
            this.hoverOrderArr = []
          this.getOrderNumber()
        }, 100)
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getPodList()
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

</style>
