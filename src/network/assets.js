import request from "./request";

const basePath = '/assets';

export default {
  /*****************资产标签相关******************/
  //获取标签列表
  tagsGet(params = null) {
    return request.get(basePath + '/tags/', params)
  },
  //添加标签
  tagsPot(data) {
    return request.post(basePath + '/tags/', data)
  },
  //修改标签信息
  tagsPut(suffix, data) {
    return request.put(basePath + '/tags/' + suffix + '/', data)
  },
  //删除标签
  tagsDelete(suffix) {
    return request.delete(basePath + '/tags/' + suffix + '/')
  },

  /*****************资产IDC机房相关******************/
  //获取机房列表
  IDCGet(params = null) {
    return request.get(basePath + '/idc/', params)
  },
  //添加机房
  IDCPot(data) {
    return request.post(basePath + '/idc/', data)
  },
  //修改机房信息
  IDCPut(suffix, data) {
    return request.put(basePath + '/idc/' + suffix + '/', data)
  },
  //删除机房
  IDCDelete(suffix) {
    return request.delete(basePath + '/idc/' + suffix + '/')
  },

  /*****************资产主机相关******************/
  //获取机房列表
  serversGet(params = null) {
    return request.get(basePath + '/servers/', params)
  },
  //添加机房
  serversPot(data) {
    return request.post(basePath + '/servers/', data)
  },
  //修改机房信息
  serversPut(suffix, data) {
    return request.noQsPut(basePath + '/servers/' + suffix + '/', data)
  },
  //删除机房
  serversDelete(suffix) {
    return request.delete(basePath + '/servers/' + suffix + '/')
  },
  //上传key
  uploadKeyUrl() {
    return request.getBaseUrl() + 'webssh/upload_key/'
  },

  /*****************webssh相关******************/
  websshUrl() {
    return request.getWebsocketUrl()
  }
}
