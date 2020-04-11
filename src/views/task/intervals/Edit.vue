<template>
  <div id="interval_edit">
    <div>
      <el-button type="text" icon="el-icon-d-arrow-left" @click="backInterval">返回</el-button>
    </div>
    <div class="task_detail">
      <el-form
        :model="intervalForm"
        :rules="intervalFormRules"
        ref="intervalFormRef"
        label-position="left"
        label-width="150px">
        <el-card>

          <el-form-item label="周期数:" prop="every">
            <el-input-number v-model="intervalForm.every" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="类型:" prop="period">
            <el-select v-model="intervalForm.period" placeholder="请选择">
              <el-option
                v-for="(item, index) in intervalType"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-card>
      </el-form>
      <el-card>
        <div class="interval_button">
          <el-button class="el-icon-arrow-left" @click="backInterval">返回</el-button>
          <el-button class="el-icon-delete" type="danger"
                     @click="deleteInterval">删除
          </el-button>
        </div>
        <div class="interval_button interval_update">
          <el-button type="primary" @click="updateInterval">修改</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Edit",
    data() {
      return {
        intervalId: '',
        intervalForm: '',
        intervalFormRules: {},
        intervalType: ['days', 'hours', 'minutes', 'seconds', 'microseconds'],
      }
    },
    created() {
      this.intervalId = this.$route.query.id;
      this.getIntervalDetail(this.intervalId);
    },
    methods: {
      getIntervalDetail(id) {
        this.$api.intervalDetailGet(id).then(res => {
          this.intervalForm = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      async deleteInterval() {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该interval, 是否继续?',
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
        this.$api.intervalDelete(this.intervalId).then(res => {
          this.backInterval()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      updateInterval() {
        this.$refs.intervalFormRef.validate(valid => {
          if (!valid) return;
          this.$api.intervalPut(this.intervalId, this.intervalForm).then(res => {
            this.$message.success('修改成功！');
            this.backInterval();
          }).catch(err => {
            console.log(err.response.status);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      backInterval() {
        this.$router.push('/intervals/')
      }
    }
  }
</script>

<style scoped>
  #interval_edit {
    width: 1200px;
    display: flex;
    justify-self: center
  }

  .el-form-item__label {
    font-family: 微软雅黑;
    font-size: 22px !important;
  }

  .el-input {
    max-width: 600px;
  }

  .task_detail {
    width: 100%;
    margin-top: 30px;
  }

  .interval_button {
    display: inline-block;
  }

  .interval_update {
    float: right;
  }
</style>
