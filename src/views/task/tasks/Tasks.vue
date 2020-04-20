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
        :data="tasksList">
        <el-table-column
          prop="name"
          label="名称"
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
          width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.one_off" type="primary" disable-transitions>{{scope.row.one_off}}
            </el-tag>
            <el-tag v-else type="danger" disable-transitions>{{scope.row.one_off}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="90">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" :disabled="scope.row.task === 'celery.backend_cleanup'" @change="updateState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_run_count"
          label="已执行次数"
          width="100">
        </el-table-column>
        <el-table-column
          label="开始时间"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.start_time">{{scope.row.start_time | dataFormat }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后一次执行时间"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.last_run_at">{{scope.row.last_run_at | dataFormat }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          label="更新时间"-->
        <!--          width="180">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span v-if="scope.row.date_changed">{{scope.row.date_changed | dataFormat }}</span>-->
        <!--            <span v-else>无</span>-->
        <!--            </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="interval"-->
        <!--          label="间隔"-->
        <!--          width="180">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="crontab"-->
        <!--          label="crontab"-->
        <!--          width="180">-->
        <!--        </el-table-column>-->
        <!--        <el-table-column-->
        <!--          prop="clocked"-->
        <!--          label="clocked"-->
        <!--          width="180">-->
        <!--        </el-table-column>-->
        <!--    <el-table-column-->
        <!--          prop="description"-->
        <!--          label="描述">-->
        <!--        </el-table-column>-->
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
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Tasks",
    data() {
      return {
        queryInfo: {
          // 当前页数
          page: 1,
          // 每页显示多少数据
          page_size: 5
        },
        total: 0,
        tasksList: "",

      }
    },
    created() {
      this.getTasksList()
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
        console.log(taskInfo)
        this.$api.Tasks.taskPut(
          taskInfo.id,
          taskInfo
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
