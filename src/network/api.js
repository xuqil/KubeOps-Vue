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

  //登录用户信息
  userDetail(suffix) {
    return request.get('/user/' + suffix + '/')
  },
  //修改登录用户信息
  userUpdate(suffix, data) {
    return request.put('/user/' + suffix + '/', data)
  },
  //修改登录用户密码
  passwordUpdate(data) {
    return request.put('/password/', data)
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
  userDelete(suffix) {
    return request.delete('/users/' + suffix + '/')
  },

  /*****************菜单相关******************/
  //获取树形菜单
  menuTree() {
    return request.get('/menu/tree/')
  },

  /*****************角色相关******************/
  //获取角色列表
  rolesGet(params = null) {
    return request.get('/roles/', params)
  },
  //更新角色信息
  rolesPut(suffix, data) {
    return request.noQsPut('/roles/' + suffix + '/', data)
  },
  //添加角色
  rolesPot(data) {
    return request.post('/roles/', data)
  },
  //删除角色
  rolesDelete(suffix) {
    return request.delete('/roles/' + suffix + '/')
  },
  /*****************权限相关******************/
  //获取权限列表
  rightsGet(params = null) {
    return request.get('/permissions/', params)
  },
  //添加权限
  rightsPot(data) {
    return request.post('/permissions/', data)
  },
  //修改权限信息
  rightsPut(suffix, data) {
    return request.put('/permissions/' + suffix + '/', data)
  },
  //删除权限
  rightsDelete(suffix) {
    return request.delete('/permissions/' + suffix + '/')
  },

  /*****************资产标签相关******************/
  //获取标签列表
  tagsGet(params = null) {
    return request.get('/tags/', params)
  },
  //添加标签
  tagsPot(data) {
    return request.post('/tags/', data)
  },
  //修改标签信息
  tagsPut(suffix, data) {
    return request.put('/tags/' + suffix + '/', data)
  },
  //删除标签
  tagsDelete(suffix) {
    return request.delete('/tags/' + suffix + '/')
  },

  /*****************资产IDC机房相关******************/
  //获取机房列表
  IDCGet(params = null) {
    return request.get('/idc/', params)
  },
  //添加机房
  IDCPot(data) {
    return request.post('/idc/', data)
  },
  //修改机房信息
  IDCPut(suffix, data) {
    return request.put('/idc/' + suffix + '/', data)
  },
  //删除机房
  IDCDelete(suffix) {
    return request.delete('/idc/' + suffix + '/')
  },


}
