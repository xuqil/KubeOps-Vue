import request from "./request";

export default {
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
