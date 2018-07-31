import axios from 'axios'
import store from '@/store'
import { getToken } from '@/auth'
import { User } from '@/store/modules/user'
import router from '@/router'
// const Accept = `application/x.${process.env.VUE_APP_API_SUBTYPE}.${process.env.VUE_APP_API_VERSION}+json`
// create an axios instance
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const service = axios.create({
  baseURL: `/${process.env.VUE_APP_API_PREFIX}`,
  timeout: 5000 // request timeout
  // headers: {Accept}
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${getToken()}` // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(

  response => {
    const token = response.headers.authorization
    if (token) {
      // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
      console.log(token)
    }
    return response
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    switch (error.response.status) {
      // 如果响应中的 http code 为 401，那么则此用户可能 token 失效了之类的，我会触发 logout 方法，清除本地的数据并将用户重定向至登录页面
      case 401:
        console.log('logout')
        User.getInstance.logout().then(() => {

        })
        break
      // 如果响应中的 http code 为 400，那么就弹出一条错误提示给用户
    }
    console.log('err' + error)// for debug
    // Message({
    //   message: error.response.data.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error.response)
  })

export default service
