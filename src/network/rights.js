import request from "./request";

export default {

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
}
