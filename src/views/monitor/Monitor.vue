<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>监控管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--系统负载折线图-->
      <div id="cpu-load" style="width: 1400px;height:400px;"></div>
      <!--内存信息-->
      <div id="memory" style="width: 600px;height:400px;"></div>
      <!--CPU信息-->
      <div id="cpu_info">
        <el-card header="CPU信息" shadow="always">
          <p>CPU型号: {{cpuInfo.cpu_model}}</p>
          <p>核心数量: {{cpuInfo.cpu_core}}</p>
          <p>线程数量: {{cpuInfo.thread_count}}</p>
        </el-card>
      </div>
      <!--网卡信息-->
      <div id="network_info">
        <el-card header="网卡信息" shadow="always">
          <template v-for="(items, i) in netWorkInfo">
            <template v-for="(item, index) in items">
              <p style="display: inline-block; margin-right: 19px" v-if="index === 0">{{i}}: {{item}}</p>
              <p style="display: inline-block" v-if="index === 1">网卡名称: {{item}}</p>
            </template>
            <br/>
          </template>
          <p>平台IP:{{hostIp['ip']}}</p>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "Monitor",
    data() {
      return {
        cpuInfo: [],
        netWorkInfo: [],
        hostIp: '',
        seriesData: [],
        isLoad: true,
        memory: [],
        cpuTime: ['22:57:01', '22:57:02', '22:57:03', '22:57:04', '22:57:06', '22:57:07', '22:57:08', '22:57:09',
          '22:57:10', '22:57:11', '22:57:12', '22:57:13', '22:57:14', '22:57:15', '22:57:16'],
        avg1: [2.81, 2.75, 2.75, 2.75, 2.75, 2.75, 2.85, 2.85, 2.85, 2.85, 2.85, 2.70, 2.70, 2.70, 2.70],
        avg5: [2.11, 2.11, 2.11, 2.11, 2.11, 2.11, 2.14, 2.14, 2.14, 2.14, 2.14, 2.13, 2.13, 2.13, 2.13],
        avg15: [1.79, 1.80, 1.80, 1.80, 1.80, 1.80, 1.81, 1.81, 1.81, 1.81, 1.81, 1.80, 1.80, 1.80, 1.80],
      }
    },
    mounted() {
      this.initSystemLoadEcharts();
      this.initMemoryEcharts();
      this.getSystemLoad();
      this.getMemoryInfo();
    },
    watch: {
      cpuTime() {
        this.timer()
      }
    },
    created() {
      this.getCpuInfo();
      this.getNetWorkInfo();
      this.getHostIp();
    },
    methods: {
      //获取CPU信息
      getCpuInfo() {
        this.$api.cpuInfo().then(res => {
          this.cpuInfo = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取网卡信息
      getNetWorkInfo() {
        this.$api.netWorkInfo().then(res => {
          this.netWorkInfo = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取平台IP
      getHostIp() {
        this.$api.hostIp().then(res => {
          this.hostIp = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取系统负载
      getSystemLoad() {
        let cpuLoad = echarts.init(document.getElementById('cpu-load'));
        this.$api.systemLoad().then(res => {
          if (this.cpuTime.length >= 15) {
            this.cpuTime.shift();
            this.avg1.shift();
            this.avg5.shift();
            this.avg15.shift();
          }
          this.cpuTime.push(res.data['time']);
          this.avg1.push(res.data['load_v1']);
          this.avg5.push(res.data['load_v5']);
          this.avg15.push(res.data['load_v15']);
          // 填入数据
          cpuLoad.setOption({
            xAxis: {
              data: this.cpuTime
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '1分钟平均负载',
              data: this.avg1
            }, {
              // 根据名字对应到相应的系列
              name: '5分钟平均负载',
              data: this.avg5
            }, {
              // 根据名字对应到相应的系列
              name: '15分钟平均负载',
              data: this.avg15
            }]
          });
        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //获取内存信息
      getMemoryInfo() {
        let memory = echarts.init(document.getElementById('memory'));
        this.$api.memoryInfo().then(res => {
          // memory.hideLoading();
          this.memory = res.data;
          // console.log(this.memory);
          memory.setOption({
            title: {
              text: '平台内存信息' + '(内存总量:' + res.data['MemTotal'] + 'kB)'
            },
            series: [{
              name: '平台内存',
              data: [
                {value: res.data['MemFree'], name: '空闲内存数'},
                {value: res.data['MemAvailable'], name: '可用内存数'},
                {value: res.data['Buffers'], name: '缓冲区内存数'},
                {value: res.data['Cached'], name: '缓存区内存数'}
              ]
            }]
          })

        }).catch(err => {
          console.log(err);
          return this.$message.error(err.response.data.detail)
        })
      },
      //定时器
      timer() {
        return setTimeout(() => {
          this.getSystemLoad();
          this.getMemoryInfo();
        }, 1000)
      },
      //系统负载折线图
      initSystemLoadEcharts() {
        // 基于准备好的dom，初始化echarts实例
        let cpuLoad = echarts.init(document.getElementById('cpu-load'));

        // 指定图表的配置项和数据
        let cpuLoadOption = {
          title: {
            text: 'CPU负载'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['1分钟平均负载', '5分钟平均负载', '15分钟平均负载']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '1分钟平均负载',
              type: 'line',
              data: []
            },
            {
              name: '5分钟平均负载',
              type: 'line',
              data: []
            },
            {
              name: '15分钟平均负载',
              type: 'line',
              data: []
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        cpuLoad.setOption(cpuLoadOption);
      },
      //内存信息饼状图
      initMemoryEcharts() {
        let memory = echarts.init(document.getElementById('memory'));
        let memoryOption = {
          title: {
            text: '平台内存信息',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} kB'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['空闲内存数', '可用内存数', '缓冲区内存数', '缓存区内存数']
          },
          series: [
            {
              name: '平台内存',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 310, name: '空闲内存数'},
                {value: 234, name: '可用内存数'},
                {value: 135, name: '缓冲区内存数'},
                {value: 1548, name: '缓存区内存数'}
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        memory.setOption(memoryOption);
      }
    }
  }
</script>

<style scoped>
  #cpu-load {
    margin-bottom: 30px;
  }

  #cpu_info, #network_info {
    display: inline-block;
    width: 48%;
    padding-left: 10px;
  }

  #cpu_info .el-card {
    background-color: #0086b3;
  }

  #network_info .el-card {
    background-color: #63a35c;
  }

</style>
