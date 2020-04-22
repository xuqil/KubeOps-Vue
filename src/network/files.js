import request from "./request";

export default {
  /*****************文件相关******************/
  //文件上传
  uploadFilesURL() {
    return request.getBaseUrl() + 'up_files'
  },
  //文件下载
  downloadFiles(data = null) {
    return request.post('/down_files', data)
  },
  //文件下载
  deleteTmpFiles(data = null) {
    return request.put('/down_files', data)
  },
}
