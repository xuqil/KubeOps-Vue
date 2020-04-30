import request from "./request";

const basePath = '/monitor';

export default {
  /*****************监控相关******************/
  //获取CPU信息
  cpuInfo() {
    return request.get(basePath + '/cpu/')
  },
  //获取网卡信息
  netWorkInfo() {
    return request.get(basePath + '/network/')
  },
  //获取本机IP
  hostIp() {
    return request.get(basePath + '/hostip/')
  },
  //获取系统负载
  systemLoad() {
    return request.get(basePath + '/systemload/')
  },
  //获取内存信息
  memoryInfo() {
    return request.get(basePath + '/memory/')
  },
}
