<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>监控管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
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
          <template v-for="items in netWorkInfo">
            <template v-for="(item, index) in items">
              <p v-if="index === 0">IP{{index}}: {{item}}</p>
              <p v-if="index === 1">网卡名称: {{item}}</p>
            </template>
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
          return this.$message.error("获取CPU信息失败")
        })
      },
      //获取网卡信息
      getNetWorkInfo() {
        this.$api.netWorkInfo().then(res => {
          this.netWorkInfo = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error("获取网卡信息失败")
        })
      },
      getHostIp() {
        this.$api.hostIp().then(res => {
          this.hostIp = res.data;
        }).catch(err => {
          console.log(err);
          return this.$message.error("获取后端IP失败")
        })
      },
    }
  }
</script>

<style scoped>
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
