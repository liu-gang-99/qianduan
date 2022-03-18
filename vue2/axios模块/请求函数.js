import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 其他不是通过axios发请求的地方也要用到基准地址
export const baseURL = 'http://xxxxxx.com/'

const instance = axios.create({
  baseURL,
  timeout: 3000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = store.state.user.profile.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      const profile = {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
      // 清除vuex中无效数据
      store.commit('user/setUser', profile)
      // 获取当前地址并转码  使登录成功后能跳转回当前页面  http:/xxxx.com/#/login?redirectUrl=/member/checkout
      // 在组件内获取当前路由对象 this.$route
      // 在js模块在获取路由对象 router.currentRoute  是一个 ref 声明的响应式数据 需要加上 .value
      // 路径参数不能有特殊字符 所以需要转码
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
export default (url, submitData, method = 'get') => {
  return instance({
    url,
    // [] 设置一个动态的 key   如 obj[a > 10 ? 'a' : 'b']
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
