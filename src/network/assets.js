import request from "./request";

export default {
  /*****************资产标签相关******************/
  //获取标签列表
  tagsGet(params = null) {
    return request.get('/tags/', params)
  },
  //添加标签
  tagsPot(data) {
    return request.post('/tags/', data)
  },
  //修改标签信息
  tagsPut(suffix, data) {
    return request.put('/tags/' + suffix + '/', data)
  },
  //删除标签
  tagsDelete(suffix) {
    return request.delete('/tags/' + suffix + '/')
  },

  /*****************资产IDC机房相关******************/
  //获取机房列表
  IDCGet(params = null) {
    return request.get('/idc/', params)
  },
  //添加机房
  IDCPot(data) {
    return request.post('/idc/', data)
  },
  //修改机房信息
  IDCPut(suffix, data) {
    return request.put('/idc/' + suffix + '/', data)
  },
  //删除机房
  IDCDelete(suffix) {
    return request.delete('/idc/' + suffix + '/')
  },

  /*****************资产主机相关******************/
  //获取机房列表
  serversGet(params = null) {
    return request.get('/servers/', params)
  },
  //添加机房
  serversPot(data) {
    return request.post('/servers/', data)
  },
  //修改机房信息
  serversPut(suffix, data) {
    return request.noQsPut('/servers/' + suffix + '/', data)
  },
  //删除机房
  serversDelete(suffix) {
    return request.delete('/servers/' + suffix + '/')
  },
  //上传key
  uploadKeyUrl() {
    return 'http://127.0.0.1:8000/api/v1/upload_key'
  },
}
