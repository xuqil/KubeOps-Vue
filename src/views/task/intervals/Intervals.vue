<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>Interval</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="add_button">
        <el-button type="primary" @click="addInterval">添加</el-button>
      </div>
      <el-row>
        <el-col>
          <el-link type="info">
            INTERVAL
          </el-link>
        </el-col>
      </el-row>
      <el-row v-for="item in intervalsScheduleList" :key="item.id">
        <el-col>
          <el-link type="primary" @click="editInterval(item.id)">
            {{item.every}}{{item.period}}
          </el-link>
        </el-col>
      </el-row>
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
    name: "Intervals",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        total: 0,
        intervalsScheduleList: ''
      }
    },
    created() {
      this.getIntervalsScheduleList()
    },
    methods: {
      getIntervalsScheduleList() {
        this.$api.Tasks.intervalsGet(this.queryInfo).then(res => {
          // console.log(res.data)
          this.intervalsScheduleList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      editInterval(id) {
        this.$router.push({path: '/intervals/edit', query: {id: id}});
      },
      addInterval() {
        this.$router.push('/intervals/add')
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getIntervalsScheduleList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getIntervalsScheduleList()
      },
    }
  }
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .el-link {
    font-size: 18px;
    font-weight: bold;
  }

  .add_button {
    margin-bottom: 15px;
  }
</style>
