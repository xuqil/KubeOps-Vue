import request from "./request";

const basePath = '/k8s';

export default {
  /*****************kubernetes相关******************/
  //获取节点
  nodesGet() {
    return request.get(basePath + '/nodes/')
  },

  //获取命名空间
  namespacesGet(params = null) {
    return request.get(basePath + '/namespaces/', params)
  },
  //创建命名空间
  namespacesPost(data) {
    return request.post(basePath + '/namespaces/', data)
  },
  //删除命名空间
  namespacesDelete(data) {
    return request.noQsdelete(basePath + '/namespaces/', data)
  },

  //获取Pod
  podsGet(params = null) {
    return request.get(basePath + '/pods/', params)
  },
  //获取某个Pod的信息
  podDetail(params = null) {
    return request.get(basePath + '/pod', params)
  },
  //删除某个Pod的信息
  podDelete(data) {
    return request.noQsdelete(basePath + '/pod', data)
  },
  //修改Pod
  podUpdate(data) {
    return request.noQsPut(basePath + '/pod', data)
  },
  //修改Pod
  podCreate(data) {
    return request.post(basePath + '/pod', data)
  },

  //获取Deployment
  deploymentsGet(params = null) {
    return request.get(basePath + '/deployments/', params)
  },
  //获取某个Deployment的信息
  deploymentDetail(params = null) {
    return request.get(basePath + '/deployment', params)
  },
  //删除某个Deployment的信息
  deploymentDelete(data) {
    return request.noQsdelete(basePath + '/deployment', data)
  },
  //修改Deployment
  deploymentUpdate(data) {
    return request.noQsPut(basePath + '/deployment', data)
  },
  //创建Deployment
  deploymentCreate(data) {
    return request.post(basePath + '/deployment', data)
  },
}
