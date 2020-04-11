<template>
  <div id="crontab_edit">
    <div>
      <el-button type="text" icon="el-icon-d-arrow-left" @click="backCrontab">返回</el-button>
    </div>
    <div class="task_detail">
      <el-form
        :model="crontabForm"
        :rules="crontabFormRules"
        ref="crontabFormRef"
        label-position="left"
        label-width="150px">
        <el-card>
          <div slot="header">
            <span>时间表</span>
          </div>
          <el-form-item label="分钟" prop="minute">
            <el-input v-model="crontabForm.minute"></el-input>
            <div class="tip_message">分钟。使用“*”表示“全部”。（例如：“0,30”）
            </div>
          </el-form-item>
          <el-form-item label="小时" prop="hour">
            <el-input v-model="crontabForm.hour"></el-input>
            <div class="tip_message">小时。使用“*”表示“全部”。（例如：“8,20”）
            </div>
          </el-form-item>
          <el-form-item label="星期几" prop="day_of_week">
            <el-input v-model="crontabForm.day_of_week"></el-input>
            <div class="tip_message">小时。使用“*”表示“全部”。（例如：“0,5”）
            </div>
          </el-form-item>
          <el-form-item label="日" prop="day_of_month">
            <el-input v-model="crontabForm.day_of_month"></el-input>
            <div class="tip_message">小时。使用“*”表示“全部”。（例如：“1,15”）
            </div>
          </el-form-item>
          <el-form-item label="月" prop="month_of_year">
            <el-input v-model="crontabForm.month_of_year"></el-input>
            <div class="tip_message">月。使用“*”表示“全部”。（例如：“0,6”）
            </div>
          </el-form-item>
          <el-form-item label="时区" prop="timezone">
            <el-input v-model="crontabForm.timezone"></el-input>
            <div class="tip_message">默认Asia/Shanghai
            </div>
          </el-form-item>
        </el-card>
      </el-form>
      <el-card>
        <div class="crontab_button">
          <el-button class="el-icon-arrow-left" @click="backCrontab">返回</el-button>
          <el-button class="el-icon-delete" type="danger"
                     @click="deleteCrontab">删除
          </el-button>
        </div>
        <div class="crontab_button crontab_update">
          <el-button type="primary" @click="updateCrontab">修改</el-button>
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
        crontabId: '',
        crontabForm: '',
        crontabFormRules: {}
      }
    },
    created() {
      this.crontabId = this.$route.query.id;
      this.getCrontabDetail(this.crontabId);
    },
    methods: {
      getCrontabDetail(id) {
        this.$api.crontabDetailGet(id).then(res => {
          this.crontabForm = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      async deleteCrontab() {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该crontab, 是否继续?',
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
        this.$api.crontabDelete(this.crontabId).then(res => {
          this.backCrontab()
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      updateCrontab() {
        this.$refs.crontabFormRef.validate(valid => {
          if (!valid) return;
          this.$api.crontabPut(this.crontabId, this.crontabForm).then(res => {
            this.$message.success('修改成功！');
            this.$router.push('/crontab/');
          }).catch(err => {
            console.log(err.response.status);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      backCrontab() {
        this.$router.push('/crontab/')
      }
    }
  }
</script>

<style scoped>
  #crontab_edit {
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

  .crontab_button {
    display: inline-block;
  }

  .crontab_update {
    float: right;
  }
</style>
