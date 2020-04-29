<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>Crontab</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="add_button">
        <el-button type="primary" @click="addCrontab">添加</el-button>
      </div>
      <el-row>
        <el-col>
          <el-link type="info">
            CRONTAB
          </el-link>
        </el-col>
      </el-row>
      <el-row v-for="item in crontabScheduleList" :key="item.id">
        <el-col>
          <el-link type="primary" @click="editCrontab(item.id)">
            {{item.minute}}
            {{item.hour}}
            {{item.day_of_week}}
            {{item.day_of_month}}
            {{item.month_of_year}}
            (m/h/d/dM/MY)
            {{item.timezone}}
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
    name: "Crontab",
    data() {
      return {
        queryInfo: {
          page: 1,
          page_size: 10
        },
        total: 0,
        crontabScheduleList: ''
      }
    },
    created() {
      this.getCrontabScheduleList()
    },
    methods: {
      getCrontabScheduleList() {
        this.$api.Tasks.crontabsGet(this.queryInfo).then(res => {
          this.crontabScheduleList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      editCrontab(id) {
        this.$router.push({path: '/crontab/edit', query: {id: id}});
      },
      addCrontab() {
        this.$router.push('/crontab/add');
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getCrontabScheduleList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getCrontabScheduleList()
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
