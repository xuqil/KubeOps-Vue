<template>
  <div id="clocked_edit">
    <div>
      <el-button type="text" icon="el-icon-d-arrow-left" @click="backClocked">返回</el-button>
    </div>
    <div class="task_detail">
      <el-form
        :model="clockedForm"
        :rules="clockedFormRules"
        ref="clockedFormRef"
        label-position="left"
        label-width="150px">
        <el-card>

          <el-form-item label="Clock Time:">
            <el-date-picker
              v-model="clockedForm.clocked_time"
              type="datetime"
              placeholder="选择日期时间"
              align="left"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div class="tip_message">按时执行任务</div>
          </el-form-item>
          <el-form-item label="Enabled:" prop="enabled">
            <el-checkbox v-model="clockedForm.enabled" disabled></el-checkbox>
            <div class="tip_message">设置为False可禁用计划
            </div>
          </el-form-item>
        </el-card>
      </el-form>
      <el-card>
        <div class="clocked_button">
          <el-button class="el-icon-arrow-left" @click="backClocked">返回</el-button>
          <el-button class="el-icon-delete" type="danger"
                     @click="deleteClocked">删除
          </el-button>
        </div>
        <div class="clocked_button clocked_update">
          <el-button type="primary" @click="updateClocked">修改</el-button>
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
        clockedId: '',
        clockedForm: '',
        clockedFormRules: {},
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    created() {
      this.clockedId = this.$route.query.id;
      this.getClockedDetail(this.clockedId);
    },
    methods: {
      getClockedDetail(id) {
        this.$api.Tasks.clockedDetailGet(id).then(res => {
          this.clockedForm = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      async deleteClocked() {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该clocked, 是否继续?',
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
        this.$api.Tasks.clockedDelete(this.clockedId).then(res => {
          this.backClocked()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      updateClocked() {
        this.$refs.clockedFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Tasks.clockedPut(this.clockedId, this.clockedForm).then(res => {
            this.$message.success('修改成功！');
            this.backClocked();
          }).catch(err => {
            console.log(err.response.status);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      backClocked() {
        this.$router.push('/clocked/')
      }
    }
  }
</script>

<style scoped>
  #clocked_edit {
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

  .clocked_button {
    display: inline-block;
  }

  .clocked_update {
    float: right;
  }
</style>
