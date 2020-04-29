<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>Clocked</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="add_button">
        <el-button type="primary" @click="addClock">添加</el-button>
      </div>
      <el-row>
        <el-col :span="18">
          <el-link type="info">
            CLOCK TIME
          </el-link>
        </el-col>
        <el-col :span="6">
          <el-link type="info">
            ENABLED
          </el-link>
        </el-col>
      </el-row>
      <el-row v-for="item in clockedScheduleList" :key="item.id">
        <el-col :span="18">
          <el-link type="primary" @click="editClocked(item.id)">
            {{item.clocked_time}}
          </el-link>
        </el-col>
        <el-col :span="6">
          <el-tag v-if="item.enabled" type="primary" disable-transitions>{{item.enabled}}
          </el-tag>
          <el-tag v-else type="danger" disable-transitions>{{item.enabled}}</el-tag>
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
    name: "Clocked",
    data() {
      return {
        queryInfo: {
          page: 10,
          page_size: 10
        },
        total: 0,
        clockedScheduleList: ''
      }
    },
    created() {
      this.getClockedScheduleList()
    },
    methods: {
      getClockedScheduleList() {
        this.$api.Tasks.clockedGet(this.queryInfo).then(res => {
          this.clockedScheduleList = res.data.results;
          this.total = res.data.count;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      editClocked(id) {
        this.$router.push({path: '/clocked/edit', query: {id: id}});
      },
      addClock() {
        this.$router.push('/clocked/add');
      },
      //分页
      handleSizeChange(newSize) {
        this.queryInfo.page_size = newSize;
        this.getClockedScheduleList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getClockedScheduleList()
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
