import request from "./request";

export default {
  /*****************kubernetes相关******************/
  //获取节点
  nodesGet() {
    return request.get('/nodes/')
  },

  //获取命名空间
  namespacesGet(params = null) {
    return request.get('/namespaces/', params)
  },
  //创建命名空间
  namespacesPost(data) {
    return request.post('/namespaces/', data)
  },
  //删除命名空间
  namespacesDelete(data) {
    return request.noQsdelete('/namespaces/', data)
  },

  //获取Pod
  podsGet(params = null) {
    return request.get('/pods/', params)
  },
  //获取某个Pod的信息
  podDetail(params = null) {
    return request.get('/pod', params)
  },
  //删除某个Pod的信息
  podDelete(data) {
    return request.noQsdelete('/pod', data)
  },
  //修改Pod
  podUpdate(data) {
    return request.noQsPut('/pod', data)
  },
  //修改Pod
  podCreate(data) {
    return request.post('/pod', data)
  },

  //获取Deployment
  deploymentsGet(params = null) {
    return request.get('/deployments/', params)
  },
  //获取某个Deployment的信息
  deploymentDetail(params = null) {
    return request.get('/deployment', params)
  },
  //删除某个Deployment的信息
  deploymentDelete(data) {
    return request.noQsdelete('/deployment', data)
  },
  //修改Deployment
  deploymentUpdate(data) {
    return request.noQsPut('/deployment', data)
  },
  //创建Deployment
  deploymentCreate(data) {
    return request.post('/deployment', data)
  },
}
