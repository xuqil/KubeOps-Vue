import request from "./request";

const basePath = '/power';

export default {
  /*****************登录相关******************/
  //登录请求
  login(data) {
    return request.post(basePath + '/login/', data)
  },

  /*****************用户相关******************/
  //注册请求
  register(data) {
    return request.post(basePath + '/register/', data)
  },

  //登录用户信息
  userDetail(suffix) {
    return request.get(basePath + '/user/' + suffix + '/')
  },
  //修改登录用户信息
  userUpdate(suffix, data) {
    return request.put(basePath + '/user/' + suffix + '/', data)
  },
  //修改登录用户密码
  passwordUpdate(data) {
    return request.put(basePath + '/password/', data)
  },

  //用户列表
  usersGet(params) {
    return request.get(basePath + '/users/', params)
  },
  //修改用户信息
  usersPut(suffix, data) {
    return request.put(basePath + '/users/' + suffix + '/', data)
  },
  //添加用户
  userAdd(data) {
    return request.post(basePath + '/user/', data)
  },
  //删除用户
  userDelete(suffix) {
    return request.delete(basePath + '/users/' + suffix + '/')
  },
}
