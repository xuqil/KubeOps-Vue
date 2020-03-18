import request from './request'


export default {
  /*****************登录相关******************/
  //登录请求
  login(data) {
    return request.post('/login/', data)
  },

  /*****************用户相关******************/
  //注册请求
  register(data) {
    return request.post('/register/', data)
  },

  //用户列表
  usersGet(params) {
    return request.get('/users/', params)
  },
  //修改用户信息
  usersPut(suffix, data) {
    return request.put('/users/' + suffix + '/', data)
  },
  //添加用户
  userAdd(data) {
    return request.post('/user/', data)
  },
  //删除用户
  userDelete(suffix, data) {
    return request.delete('/users/' + suffix + '/', data)
  },

  /*****************菜单相关******************/
  //获取树形菜单
  menuTree() {
    return request.get('/menu/tree/')
  },

  /*****************角色相关******************/
  //获取角色列表
  rolesGet(params=null) {
    return request.get('/roles/', params)
  },
  //更新角色信息
  rolesPut(suffix, data) {
    return request.put('/roles/' + suffix + '/', data)
  },

  /*****************权限相关******************/
  rightsGet(params=null) {
    return request.get('/permissions/', params)
  }
}
