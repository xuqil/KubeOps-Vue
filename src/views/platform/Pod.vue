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
      :data="podList"
      :span-method="objectSpanMethod"
      :cell-class-name="tableCellClassName"
      @cell-mouse-leave="cellMouseLeave"
      @cell-mouse-enter="cellMouseEnter"
      :row-class-name="tableRowClassName"
      :header-cell-style="getTableHeaderStyle"
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
      <el-table-column label="操作"  fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="readPod(scope.row)">查看和编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.namespace === 'kube-system'"
            @click="deletePod(scope.row)">删 除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[5, 10, 15, 20]"
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
      <span v-if="detailDialogVisible">
        <Editor></Editor>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="updatePod">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from "components/common/editor/Editor";
  import {mapGetters} from "vuex";

  export default {
    name: "Pod",
    components: {
      Editor
    },
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10,
          //命名空间
          namespace: null
        },
        total: 0,
        podList: '',
        rowIndex: '-1',
        orderIndexArr: [],
        hoverOrderArr: [],
        //筛选
        selectedNamespace: '',
        namespaceList: '',
        //pod详细详细
        podInfo: '',
        updateInfo: '',
        detailDialogVisible: false
      }
    },
    created() {
      this.getPodList();
      this.getNamespaceList();
      this.initCodeMirror();
    },
    mounted() {
      setTimeout(() => {
        this.getOrderNumber()
      }, 1000)
    },
    computed: {
      ...mapGetters([
        'getTableHeaderStyle'
      ]),
    },
    methods: {
      ...mapGetters([
        'getCodeValue'
      ]),
      initCodeMirror() {
        this.$store.commit('saveCodeType', 'application/json')
      },
      initCodeValue(value) {
        this.$store.commit('saveCodeValue', value)
      },
      //获取Pod列表
      getPodList() {
        this.$api.K8S.podsGet(this.queryInfo).then(res => {
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.podList = res.data.results;
            this.total = res.data.count;
            // console.log(this.podList)
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
        this.$api.K8S.namespacesGet(this.queryInfo).then(res => {
          if (res.data.status === 200) {
            this.namespaceList = res.data.results;
            // console.log(this.namespaceList)
          } else {
            return Promise.reject(res)
          }
        }).catch(err => {
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('服务器错误!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        })
      },
      //筛选
      fileByNamespace() {
        this.getPodList(this.queryInfo);
      },
      //详细信息
      readPod(row) {
        let read = {name: row.name, namespace: row.namespace};
        this.updateInfo = read;
        // console.log(read);
        this.$api.K8S.podDetail(read).then(res => {
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.podInfo = res.data.results;
            // console.log(this.podInfo)
            this.initCodeValue(this.podInfo);
          }
          this.detailDialogVisible = true;
        }).catch(err => {
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('服务器错误!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        })
      },
      handleClose() {
        this.podInfo = '';
        this.initCodeValue('');
      },
      //更新Pod
      updatePod() {
        this.updateInfo['body'] = this.getCodeValue();
        if (this.updateInfo['body'] === '') {
          return this.$message.error('内容不能为空!')
        }
        this.$api.K8S.podUpdate(this.updateInfo).then(res => {
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.$message.success(res.data.msg);
          }
          this.detailDialogVisible = false;
        }).catch(err => {
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('服务器错误!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        })
      },
      async deletePod(row) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该Pod, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        let pod = {name: row.name, namespace: row.namespace};
        // console.log(msg);
        this.$api.K8S.podDelete(pod).then(res => {
          // console.log(res.data.status)
          if (res.data.status === 400) {
            return Promise.reject(res)
          } else {
            this.$message.success(res.data.msg);
            this.getPodList(this.queryInfo);
          }
        }).catch(err => {
          try {
            return this.$message.error(err.data.msg)
          } catch (e) {
            if (err.response.status === 500) {
              return this.$message.error('服务器错误!')
            } else {
              return this.$message.error(err.response.data.detail)
            }
          }
        })
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
