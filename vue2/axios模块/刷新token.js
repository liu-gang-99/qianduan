import axios from 'axios'
import store from '@/store'
import router from '@/router'

const serve = axios.create({
  baseURL: 'http://localhost:8000'
})

// 请求拦截器
serve.interceptors.request.use((config) => {
  const { user } = store.state
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// 响应拦截器
serve.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    // 判断是否为 token 失效
    if (err.response?.status === 401) {
      const { user } = store.state
      // 判断是否有 refresh_token
      if (!user || !user.refresh_token) {
        return router.push('/login')
      }
      try {
        // 发送请求刷新token
        const { data } = await serve({
          url: '/v1_0/authorizations',
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 将新 token 存入 vuex
        store.commit('setUser', {
          token: data.data.token,
          refresh_token: user.refresh_token
        })
        // 返回一个新的请求
        return serve(err.config)
      } catch (error) {
        console.log(error)
        router.push('/login')
      }
    }
    return Promise.reject(err)
  }
)
export default serve
