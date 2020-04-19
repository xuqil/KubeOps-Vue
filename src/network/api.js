import request from './request'
import {registerPostUpdate} from "echarts/src/echarts";


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

  /*****************资产主机相关******************/
  //获取机房列表
  serversGet(params = null) {
    return request.get('/servers/', params)
  },
  //添加机房
  serversPot(data) {
    return request.post('/servers/', data)
  },
  //修改机房信息
  serversPut(suffix, data) {
    return request.noQsPut('/servers/' + suffix + '/', data)
  },
  //删除机房
  serversDelete(suffix) {
    return request.delete('/servers/' + suffix + '/')
  },
  //上传key
  uploadKeyUrl() {
    return 'http://127.0.0.1:8000/api/v1/upload_key'
  },

  /*****************监控相关******************/
  //获取CPU信息
  cpuInfo() {
    return request.get('/cpu/')
  },
  //获取网卡信息
  netWorkInfo() {
    return request.get('/network/')
  },
  //获取本机IP
  hostIp() {
    return request.get('/hostip/')
  },
  //获取系统负载
  systemLoad() {
    return request.get('/systemload/')
  },
  //获取内存信息
  memoryInfo() {
    return request.get('/memory/')
  },

  /*****************文件相关******************/
  //文件上传
  uploadFilesURL() {
    return 'http://127.0.0.1:8000/api/v1/up_files'
  },
  //文件下载
  downloadFiles(data = null) {
    return request.post('/down_files', data)
  },
  //文件下载
  deleteTmpFiles(data = null) {
    return request.put('/down_files', data)
  },

  /*****************wiki相关******************/
  //添加文章
  postPost(data) {
    return request.post('/wiki/posts/', data)
  },
  //获取文章
  postsGet(params = null) {
    return request.get('/wiki/posts/', params)
  },
  //获取某文章
  postDetailGet(suffix) {
    return request.get('/wiki/posts/' + suffix + '/')
  },
  //修改文章
  postPut(suffix, data) {
    return request.noQsPut('/wiki/posts/' + suffix + '/', data)
  },
  //删除文章
  postDelete(suffix) {
    return request.delete('/wiki/posts/' + suffix + '/')
  },

  //添加wiki标签
  wikiTagsPost(data) {
    return request.post('/wiki/tags/', data)
  },
  //获取wiki标签
  wikiTagsGet(params = null) {
    return request.get('/wiki/tags/', params)
  },
  //修改文章
  wikiTagPut(suffix, data) {
    return request.put('/wiki/tags/' + suffix + '/', data)
  },
  //删除文章
  wikiTagDelete(suffix) {
    return request.delete('/wiki/tags/' + suffix + '/')
  },

  //添加wiki分类
  wikiCategoryPost(data) {
    return request.post('/wiki/categories/', data)
  },
  //获取wiki分类
  wikiCategoriesGet(params = null) {
    return request.get('/wiki/categories/', params)
  },
  //修改分类
  wikiCategoryPut(suffix, data) {
    return request.put('/wiki/categories/' + suffix + '/', data)
  },
  //删除分类
  wikiCategoryDelete(suffix) {
    return request.delete('/wiki/categories/' + suffix + '/')
  },


  //添加wiki评论
  wikiCommentPost(data) {
    return request.post('/wiki/comments/', data)
  },
  //获取wiki评论
  wikiCommentsGet(params = null) {
    return request.get('/wiki/comments/', params)
  },
  //修改评论
  wikiCommentPut(suffix, data) {
    return request.put('/wiki/comments/' + suffix + '/', data)
  },
  //删除评论
  wikiCommentDelete(suffix) {
    return request.delete('/wiki/comments/' + suffix + '/')
  },

  /*****************系统设置相关******************/
  //获取颜色
  backgroundColorGet() {
    return request.get('/settings/')
  },
  //更新颜色
  backgroundColorPut(suffix, data) {
    return request.put('/settings/' + suffix + '/', data)
  },

  /*****************kubernetes相关******************/
  //获取节点
  nodesGet() {
    return request.get('/nodes/')
  },

  //获取命名空间
  namespacesGet(params = null) {
    return request.get('/namespaces/', params)
  },
  //创建命名空间
  namespacesPost(data) {
    return request.post('/namespaces/', data)
  },
  //删除命名空间
  namespacesDelete(data) {
    return request.noQsdelete('/namespaces/', data)
  },

  //获取Pod
  podsGet(params = null) {
    return request.get('/pods/', params)
  },
  //获取某个Pod的信息
  podDetail(params = null) {
    return request.get('/pod', params)
  },
  //删除某个Pod的信息
  podDelete(data) {
    return request.noQsdelete('/pod', data)
  },
  //修改Pod
  podUpdate(data) {
    return request.noQsPut('/pod', data)
  },
  //修改Pod
  podCreate(data) {
    return request.post('/pod', data)
  },

  //获取Deployment
  deploymentsGet(params = null) {
    return request.get('/deployments/', params)
  },
  //获取某个Deployment的信息
  deploymentDetail(params = null) {
    return request.get('/deployment', params)
  },
  //删除某个Deployment的信息
  deploymentDelete(data) {
    return request.noQsdelete('/deployment', data)
  },
  //修改Deployment
  deploymentUpdate(data) {
    return request.noQsPut('/deployment', data)
  },
  //创建Deployment
  deploymentCreate(data) {
    return request.post('/deployment', data)
  },

  /*****************任务相关******************/
  //获取已注册的任务
  taskRegisteredGet() {
    return request.get('/tasks/task/')
  },

  //获取任务
  tasksGet(data) {
    return request.get('/tasks/periodic_task/', data)
  },
  //获取某任务
  taskDetailGet(suffix) {
    return request.get('/tasks/periodic_task/' + suffix + '/')
  },
  //创建任务
  taskPost(data) {
    return request.post('/tasks/periodic_task/', data)
  },
  //修改任务
  taskPut(suffix, data) {
    return request.put('/tasks/periodic_task/' + suffix + '/', data)
  },
  //删除任务
  taskDelete(suffix) {
    return request.delete('/tasks/periodic_task/' + suffix + '/')
  },

  //时间间隔
  intervalsGet(data) {
    return request.get('/tasks/interval_schedule/', data)
  },
  intervalDetailGet(suffix) {
    return request.get('/tasks/interval_schedule/' + suffix + '/')
  },
  intervalPost(data) {
    return request.post('/tasks/interval_schedule/', data)
  },
  //修改任务
  intervalPut(suffix, data) {
    return request.put('/tasks/interval_schedule/' + suffix + '/', data)
  },
  intervalDelete(suffix) {
    return request.delete('/tasks/interval_schedule/' + suffix + '/')
  },

  //crontab
  crontabsGet(data) {
    return request.get('/tasks/crontab_schedule/', data)
  },
  crontabDetailGet(suffix) {
    return request.get('/tasks/crontab_schedule/' + suffix + '/')
  },
  crontabPost(data) {
    return request.post('/tasks/crontab_schedule/', data)
  },
  crontabPut(suffix, data) {
    return request.put('/tasks/crontab_schedule/' + suffix + '/', data)
  },
  crontabDelete(suffix) {
    return request.delete('/tasks/crontab_schedule/' + suffix + '/')
  },

  //solar
  solarsGet(data) {
    return request.get('/tasks/solar_schedule/', data)
  },
  solarDetailGet(suffix) {
    return request.get('/tasks/solar_schedule/' + suffix + '/')
  },
  solarPost(data) {
    return request.post('/tasks/solar_schedule/', data)
  },
  solarPut(suffix, data) {
    return request.put('/tasks/solar_schedule/' + suffix + '/', data)
  },
  solarDelete(suffix) {
    return request.delete('/tasks/solar_schedule/' + suffix + '/')
  },

  //clocked
  clockedGet(data) {
    return request.get('/tasks/clocked_schedule/', data)
  },
  clockedDetailGet(suffix) {
    return request.get('/tasks/clocked_schedule/' + suffix + '/')
  },
  clockedPost(data) {
    return request.post('/tasks/clocked_schedule/', data)
  },
  clockedPut(suffix, data) {
    return request.put('/tasks/clocked_schedule/' + suffix + '/', data)
  },
  clockedDelete(suffix) {
    return request.delete('/tasks/clocked_schedule/' + suffix + '/')
  },

}
