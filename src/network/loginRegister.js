import request from './request'


//登录请求
export function login(data) {
  return request.post('/login/', data)
}

//注册请求
export function register(data) {
  return request.post('/register/', data)
}
