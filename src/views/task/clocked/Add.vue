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
          <el-form-item label="Clock Time:" prop="clocked_time">
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
            <el-checkbox v-model="clockedForm.enabled"></el-checkbox>
            <div class="tip_message">设置为False可禁用计划
            </div>
          </el-form-item>
        </el-card>
      </el-form>
      <el-card>
        <div class="clocked_button">
          <el-button class="el-icon-arrow-left" @click="backClocked">返回</el-button>
        </div>
        <div class="clocked_button clocked_update">
          <el-button type="primary" @click="addClocked">添加</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Add",
    data() {
      return {
        clockedForm: {
          clocked_time: '',
          enabled: true
        },
        clockedFormRules: {
          clocked_time: [{required: true, message: '请选择计时时间', trigger: 'change'}]
        },
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
    methods: {
      addClocked() {
        this.$refs.clockedFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Tasks.clockedPost(this.clockedForm).then(res => {
            this.$message.success('添加成功！');
            this.backClocked()
          }).catch(err => {
            console.log(err);
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
