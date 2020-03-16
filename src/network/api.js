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
  users(params) {
    return request.get('/users/', params)
  }

}
