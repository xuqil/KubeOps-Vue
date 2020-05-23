<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div class="add_button">
        <el-button type="primary" @click="addTask">添加</el-button>
      </div>
      <el-table
        :data="tasksList"
        :header-cell-style="getTableHeaderStyle"
        @sort-change="sortChange">
        <el-table-column
          prop="name"
          label="名称"
          sortable="custom"
          width="180">
        </el-table-column>
        <el-table-column
          prop="task"
          label="任务"
          width="180">
        </el-table-column>
        <el-table-column
          prop="args"
          label="参数"
          width="180">
        </el-table-column>
        <el-table-column
          label="是否只执行一次"
          prop="one_off"
          sortable="custom"
          width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.one_off" type="primary" disable-transitions>{{scope.row.one_off}}
            </el-tag>
            <el-tag v-else type="danger" disable-transitions>{{scope.row.one_off}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="enabled"
          sortable="custom"
          width="90">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" :disabled="scope.row.task === 'celery.backend_cleanup'"
                       @change="updateState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_run_count"
          label="已执行次数"
          sortable="custom"
          width="120">
        </el-table-column>
        <el-table-column
          label="开始时间"
          prop="start_time"
          sortable="custom"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.start_time">{{scope.row.start_time | dataFormat }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后一次执行时间"
          prop="last_run_at"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.last_run_at">{{scope.row.last_run_at | dataFormat }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="interval"
          label="间隔"
          sortable="custom"
          width="180">
        </el-table-column>
        <el-table-column
          prop="crontab"
          label="crontab"
          sortable="custom"
          min-width="320">
        </el-table-column>
        <el-table-column
          prop="clocked"
          label="clocked"
          sortable="custom"
          width="180">
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="date_changed"
          sortable="custom"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.date_changed">{{scope.row.date_changed | dataFormat }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="100px">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="readTask(scope.row.id)">详情
            </el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="scope.row.task === 'celery.backend_cleanup'"
              @click="deleteTask(scope.row.id)">删 除
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
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Tasks",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10,
          ordering: null
        },
        total: 0,
        tasksList: "",

      }
    },
    created() {
      this.getTasksList()
    },
    computed: {
      ...mapGetters([
        'getTableHeaderStyle'
      ]),
    },
    methods: {
      //获取任务列表
      getTasksList() {
        this.$api.Tasks.tasksGet(this.queryInfo).then(res => {
          this.tasksList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //排序
      sortChange(order) {
        if (order.order === 'ascending') {
          this.queryInfo.ordering = order.prop
        } else if (order.order === 'descending') {
          this.queryInfo.ordering = '-' + order.prop
        } else {
          this.queryInfo.ordering = null
        }
        this.getTasksList()
      },
      readTask(id) {
        this.$router.push({path: '/tasks/edit', query: {id: id}});
      },
      //删除任务
      async deleteTask(id) {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该任务, 是否继续?',
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
        this.$api.Tasks.taskDelete(id).then(res => {
          this.getTasksList()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      addTask() {
        this.$router.push('/tasks/add');
      },
      updateState(taskInfo) {
        this.$api.Tasks.taskPut(
          taskInfo.id,
          {'enabled': taskInfo.enabled}
        ).then(res => {
          this.$message.success("更新任务状态成功")
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        });
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getTasksList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getTasksList()
      },
    }
  }
</script>

<style scoped>
  .add_button {
    margin-bottom: 15px;
  }
</style>
