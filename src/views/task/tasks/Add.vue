<template>
  <div id="task_edit">
    <div>
      <el-button type="text" icon="el-icon-d-arrow-left" @click="backTasks">返回</el-button>
    </div>
    <div class="task_detail">
      <el-form
        :model="taskForm"
        :rules="taskFormRules"
        ref="taskFormRef"
        label-position="left"
        label-width="150px">
        <el-card>
          <div slot="header" class="card_header">
            <span>任务</span>
          </div>
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="taskForm.name"></el-input>
          </el-form-item>
          <el-form-item label="任务函数" prop="task">
            <el-select v-model="taskForm.task" clearable placeholder="请选择任务函数">
              <el-option
                v-for="(item, index) in taskRegistered"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用" prop="enabled">
            <el-checkbox v-model="taskForm.enabled"></el-checkbox>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="taskForm.description"></el-input>
          </el-form-item>
        </el-card>
        <!--时间表-->
        <el-card>
          <div slot="header">
            <span>时间表</span>
          </div>
          <el-form-item label="时间间隔" prop="interval">
            <el-select v-model="taskForm.interval" clearable placeholder="请选择时间间隔">
              <el-option
                v-for="item in intervalScheduleList"
                :key="item.id"
                :label="item.every + ' ' + item.period"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="tip_message">运行任务的时间间隔计划。只设置一个计划类型，其余为空。</div>
          </el-form-item>
          <el-form-item label="定时器" prop="crontab">
            <el-select v-model="taskForm.crontab" clearable placeholder="请选择定时器">
              <el-option
                v-for="item in crontabScheduleList"
                :key="item.id"
                :label="item.minute + ' ' + item.hour + ' ' + item.day_of_week + ' ' + item.day_of_month + ' ' + item.month_of_year"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="tip_message">运行任务的Crontab计划。只设置一个计划类型，其余为空。</div>
          </el-form-item>
          <el-form-item label="太阳时间" prop="solar">
            <el-input disabled v-model="taskForm.solar"></el-input>
            <div class="tip_message">按计划运行任务。只设置一个计划类型，其余为空。
            </div>
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="taskForm.start_time"
              type="datetime"
              placeholder="选择日期时间"
              align="left"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div class="tip_message">按计划运行任务。只设置一个计划类型，其余为空。</div>
          </el-form-item>
          <el-form-item label="计时" prop="clocked">
            <el-select v-model="taskForm.clocked" clearable placeholder="请选择关闭时间">
              <el-option
                v-for="item in clockedScheduleList"
                :key="item.id"
                :label="item.clocked_time"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="tip_message">运行任务的Crontab计划。只设置一个计划类型，其余为空。</div>
          </el-form-item>
          <el-form-item label="最后一次执行时间">
            <span v-if="taskForm.last_run_at">{{taskForm.last_run_at | dataFormat }}</span>
            <span v-else>无</span>
            <div class="tip_message">计划上次触发任务运行的日期时间。如果“启用”设置为“false”，则重置为“无”。</div>
          </el-form-item>
          <el-form-item label="是否只执行一次" prop="one_off">
            <el-checkbox v-model="taskForm.one_off"></el-checkbox>
          </el-form-item>
        </el-card>
        <!--参数-->
        <el-card>
          <div slot="header" class="card_header">
            <span>参数</span>
          </div>
          <el-form-item label="参数" prop="args">
            <el-input type="textarea" v-model="taskForm.args"></el-input>
            <div class="tip_message">JSON编码的位置参数（例如：[“arg1”，“arg2”]）</div>
          </el-form-item>
          <el-form-item label="关键字参数" prop="kwargs">
            <el-input type="textarea" v-model="taskForm.kwargs"></el-input>
            <div class="tip_message">JSON编码的关键字参数（例如：{“argument”：“value”}）</div>
          </el-form-item>
        </el-card>
        <!--执行选项-->
        <el-card>
          <div slot="header" class="card_header">
            <span>执行选项</span>
          </div>
          <el-form-item label="到期时间">
            <el-date-picker
              v-model="taskForm.expires"
              type="datetime"
              placeholder="选择日期时间"
              align="left"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div class="tip_message">计划不再触发任务运行的日期时间</div>
          </el-form-item>
          <el-form-item label="过期时间增量（秒）" prop="expire_seconds">
            <el-input-number v-model="taskForm.expire_seconds" controls-position="right" :min="1"
                             :max="60"></el-input-number>
            <div class="tip_message">包含计划将不再触发任务运行的秒数</div>
          </el-form-item>
          <el-form-item label="队列覆盖" prop="queue">
            <el-input v-model="taskForm.queue"></el-input>
            <div class="tip_message">CELERY任务队列中定义的队列。不保留默认队列。</div>
          </el-form-item>
          <el-form-item label="交换" prop="exchange">
            <el-input v-model="taskForm.exchange"></el-input>
            <div class="tip_message">低层AMQP路由的覆盖交换</div>
          </el-form-item>
          <el-form-item label="路由密钥" prop="routing_key">
            <el-input v-model="taskForm.routing_key"></el-input>
            <div class="tip_message">为低级AMQP路由重写路由密钥</div>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-input-number v-model="taskForm.priority" controls-position="right" :min="1"
                             :max="255"></el-input-number>
            <div class="tip_message">优先级介于0和255之间。支持：RabbitMQ，Redis（优先级反转，0为最高）。</div>
          </el-form-item>
          <el-form-item label="AMQP消息头部" prop="headers">
            <el-input type="textarea" v-model="taskForm.headers"></el-input>
            <div class="tip_message">AMQP消息的JSON编码消息头。</div>
          </el-form-item>
        </el-card>
        <el-card>
          <div class="task_button">
            <el-button class="el-icon-arrow-left" @click="backTasks">返回</el-button>
          </div>
          <div class="task_button task_update">
            <el-button type="primary" @click="addTask(taskForm.id)">添加</el-button>
          </div>
        </el-card>
      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Edit",
    data() {
      return {
        taskForm: {
          enabled: true,
          args: '[]'
        },
        taskFormRules: {
          name: [{required: true, message: '必填项', trigger: 'blur'}],
          task: [{required: true, message: '必填项', trigger: 'blur'}],
        },
        taskRegistered: '',
        intervalScheduleList: '',
        crontabScheduleList: '',
        solarScheduleList: '',
        clockedScheduleList: '',
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
      this.getTaskRegistered();
      this.getIntervalScheduleList();
      this.getCrontabScheduleList();
      // this.getSolarScheduleList();
      this.getClockedScheduleList();
    },
    methods: {
      getTaskRegistered() {
        this.$api.Tasks.taskRegisteredGet().then(res => {
          if (res.data.status === 200) {
            this.taskRegistered = res.data.results;
          } else {
            return Promise.reject(res)
          }
        }).catch(err => {
          if (err.data.status === 400) {
            return this.$message.error(err.data.msg)
          } else {
            return this.$message.error(err.response.data.detail)
          }
        })
      },
      getIntervalScheduleList() {
        this.$api.Tasks.intervalsGet().then(res => {
          this.intervalScheduleList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      getCrontabScheduleList() {
        this.$api.Tasks.crontabsGet().then(res => {
          this.crontabScheduleList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      getSolarScheduleList() {
        this.$api.Tasks.solarsGet().then(res => {
          this.solarScheduleList = res.data.results;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      getClockedScheduleList() {
        this.$api.Tasks.clockedGet().then(res => {
          this.clockedScheduleList = res.data.results;
          // console.log(this.clockedScheduleList)
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      addTask(id) {
        this.$refs.taskFormRef.validate(valid => {
          if (!valid) return;
          this.$api.Tasks.taskPost(this.taskForm).then(res => {
            this.$message.success('添加成功！');
            this.backTasks();
          }).catch(err => {
            console.log(err.response.status);
            return this.$message.error(err.response.data.detail)
          });
        })
      },
      //返回
      backTasks() {
        this.$router.push('/tasks/');
      },
    }
  }
</script>

<style scoped>
  #task_edit {
    width: 100%;
    display: flex;
    justify-self: center
  }

  .task_detail {
    width: 100%;
    margin-top: 30px;
  }

  .tip_message {
    color: #C6C8C9;
  }

  .el-card {
    margin-top: 10px;
  }

  .card_header {
    font-family: 微软雅黑;
    font-size: 22px;
  }

  .el-input, .el-textarea {
    max-width: 600px;
  }

  .task_button {
    display: inline-block;
  }

  .task_update {
    float: right;
  }
</style>
