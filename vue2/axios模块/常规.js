// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth.js'
import { Message } from 'element-ui'

const timeout = 5400 // token 超时时间 单位 秒

// 创建一个axios的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3000 // 请求超时时间 单位 毫秒
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      // token 超时主动处理
      if (IsCheckTimeOut()) {
        config.headers.Authorization = `Bearer ${store.getters.token}`
      } else {
        store.dispatch('user/logout')
        router.push('/login')
        Message.error('token已超时，请重新登录')
        return Promise.reject('token已超时，请重新登录')
      }
    }
    return config // 必须返回配置
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 剥离无效数据
  (response) => {
    const { data, success, message } = response.data
    if (success) {
      return data
    }
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message)) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  },
  // token 超时被动处理
  (error) => {
    // 判断是否 token 过期
    if (error.response?.data?.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error)
    }
    return Promise.reject(error)
  }
)

// 检测token是否超时
function IsCheckTimeOut() {
  const timeStamp = getTimeStamp()
  const currentTime = Date.now()
  return (currentTime - timeStamp) / 1000 < timeout
}

// 导出axios实例
export default service
