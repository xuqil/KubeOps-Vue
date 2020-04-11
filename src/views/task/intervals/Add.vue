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
        </div>
        <div class="interval_button interval_update">
          <el-button type="primary" @click="addInterval">添加</el-button>
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
        intervalForm: {
          every: 1,
          period: 'minutes'
        },
        intervalFormRules: {
          every: [{required: true, message: '必填项', trigger: 'change'}],
          period: [{required: true, message: '必填项', trigger: 'change'}],
        },
        intervalType: ['days', 'hours', 'minutes', 'seconds', 'microseconds'],
      }
    },
    methods: {
      addInterval() {
        this.$refs.intervalFormRef.validate(valid => {
          if (!valid) return;
          this.$api.intervalPost(this.intervalForm).then(res => {
            this.$message.success('添加成功！');
            this.backInterval()
          }).catch(err => {
            console.log(err);
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
