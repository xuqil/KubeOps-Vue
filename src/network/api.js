import request from './request'


//登录请求
export function apiLogin(data) {
  return request.post('/login/', data)
}

//注册请求
export function apiRegister(data) {
  return request.post('/register/', data)
}
