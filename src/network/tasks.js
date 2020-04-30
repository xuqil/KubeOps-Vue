import request from "./request";

const basePath = '/tasks';

export default {
  /*****************任务相关******************/
  //获取已注册的任务
  taskRegisteredGet() {
    return request.get(basePath + '/task/')
  },

  //获取任务
  tasksGet(data) {
    return request.get(basePath + '/periodic_task/', data)
  },
  //获取某任务
  taskDetailGet(suffix) {
    return request.get(basePath + '/periodic_task/' + suffix + '/')
  },
  //创建任务
  taskPost(data) {
    return request.post(basePath + '/periodic_task/', data)
  },
  //修改任务
  taskPut(suffix, data) {
    return request.put(basePath + '/periodic_task/' + suffix + '/', data)
  },
  //删除任务
  taskDelete(suffix) {
    return request.delete(basePath + '/periodic_task/' + suffix + '/')
  },

  //时间间隔
  intervalsGet(data) {
    return request.get(basePath + '/interval_schedule/', data)
  },
  intervalDetailGet(suffix) {
    return request.get(basePath + '/interval_schedule/' + suffix + '/')
  },
  intervalPost(data) {
    return request.post(basePath + '/interval_schedule/', data)
  },
  //修改任务
  intervalPut(suffix, data) {
    return request.put(basePath + '/interval_schedule/' + suffix + '/', data)
  },
  intervalDelete(suffix) {
    return request.delete(basePath + '/interval_schedule/' + suffix + '/')
  },

  //crontab
  crontabsGet(data) {
    return request.get(basePath + '/crontab_schedule/', data)
  },
  crontabDetailGet(suffix) {
    return request.get(basePath + '/crontab_schedule/' + suffix + '/')
  },
  crontabPost(data) {
    return request.post(basePath + '/crontab_schedule/', data)
  },
  crontabPut(suffix, data) {
    return request.put(basePath + '/crontab_schedule/' + suffix + '/', data)
  },
  crontabDelete(suffix) {
    return request.delete(basePath + '/crontab_schedule/' + suffix + '/')
  },

  //solar
  solarsGet(data) {
    return request.get(basePath + '/solar_schedule/', data)
  },
  solarDetailGet(suffix) {
    return request.get(basePath + '/solar_schedule/' + suffix + '/')
  },
  solarPost(data) {
    return request.post(basePath + '/solar_schedule/', data)
  },
  solarPut(suffix, data) {
    return request.put(basePath + '/solar_schedule/' + suffix + '/', data)
  },
  solarDelete(suffix) {
    return request.delete(basePath + '/solar_schedule/' + suffix + '/')
  },

  //clocked
  clockedGet(data) {
    return request.get(basePath + '/clocked_schedule/', data)
  },
  clockedDetailGet(suffix) {
    return request.get(basePath + '/clocked_schedule/' + suffix + '/')
  },
  clockedPost(data) {
    return request.post(basePath + '/clocked_schedule/', data)
  },
  clockedPut(suffix, data) {
    return request.put(basePath + '/clocked_schedule/' + suffix + '/', data)
  },
  clockedDelete(suffix) {
    return request.delete(basePath + '/clocked_schedule/' + suffix + '/')
  },
}
