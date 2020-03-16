import request from './request'


export default {
  //登录请求
  login(data) {
    return request.post('/login/', data)
  },

//注册请求
  register(data) {
    return request.post('/register/', data)
  },

//  用户列表
  usersGet(params) {
    return request.get('/users/', params)
  },
  //修改用户信息
  usersPut(suffix, data) {
    return request.put('/users/' + suffix + '/', data)
  },
//  添加用户
  userAdd(data) {
    return request.post('/user/', data)
  },
}
