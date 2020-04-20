import request from "./request";

export default {
  /*****************监控相关******************/
  //获取CPU信息
  cpuInfo() {
    return request.get('/cpu/')
  },
  //获取网卡信息
  netWorkInfo() {
    return request.get('/network/')
  },
  //获取本机IP
  hostIp() {
    return request.get('/hostip/')
  },
  //获取系统负载
  systemLoad() {
    return request.get('/systemload/')
  },
  //获取内存信息
  memoryInfo() {
    return request.get('/memory/')
  },
}
