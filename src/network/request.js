import axios from 'axios'
import Qs from 'qs'


function baseConfig(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    timeout: 50000
  });

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    //在请求头中添加token认证
    config.headers.Authorization = 'jwt ' + window.sessionStorage.getItem('token');
    return config
  }, error => {
    return Promise.reject(error)
  });

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return Promise.resolve(res);
  }, error => {
    return Promise.reject(error)
  });

  return instance(config)
}


// get，post请求方法
export default {
  post(url, data) {
    return baseConfig({
      method: 'post',
      url,
      data: Qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  get(url, params = null) {
    return baseConfig({
      method: 'get',
      url,
      params
    })
  },
  put(url, data) {
    return baseConfig({
      method: 'put',
      url,
      data: Qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  noQsPut(url, data) {
    return baseConfig({
      method: 'put',
      url,
      data: data
    })
  },
  delete(url, data = null) {
    return baseConfig({
      method: 'delete',
      url,
      params: Qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
}
