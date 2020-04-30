import request from "./request";

const basePath = '/file';

export default {
  /*****************文件相关******************/
  //文件上传
  uploadFilesURL() {
    return request.getBaseUrl() + 'file/up_files/'
  },
  //文件下载
  downloadFiles(data = null) {
    return request.post(basePath + '/down_files/', data)
  },
  //文件下载
  deleteTmpFiles(data = null) {
    return request.put(basePath + '/down_files/', data)
  },
}
