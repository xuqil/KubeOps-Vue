import request from "./request";

const basePath = '/settings';

export default {
  /*****************系统设置相关******************/
  //获取颜色
  backgroundColorGet() {
    return request.get(basePath + '/settings/')
  },
  //更新颜色
  backgroundColorPut(suffix, data) {
    return request.put(basePath + '/settings/' + suffix + '/', data)
  },
}
