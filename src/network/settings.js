import request from "./request";

export default {
  /*****************系统设置相关******************/
  //获取颜色
  backgroundColorGet() {
    return request.get('/settings/')
  },
  //更新颜色
  backgroundColorPut(suffix, data) {
    return request.put('/settings/' + suffix + '/', data)
  },
}
