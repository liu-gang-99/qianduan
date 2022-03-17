import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(),
  userInfo: {} // 我们会在 getters 中引用userinfo的变量，如果设置为null，则会引起异常和报错
}

// 修改状态
const mutations = {
  // 封装vuex的setToken
  setToken(state, token) {
    state.token = token
    setToken(token) // 调用引入的setToken
  },

  removeToken(state) {
    state.token = null
    removeToken()
  },

  // 保存用户个人信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },

  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setTimeStamp() // 存入当前时间戳
  },

  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId) // 为了获取头像
    const baseResult = { ...res, ...baseInfo }
    context.commit('setUserInfo', baseResult)
    return res // 跳转时接收权限
  },

  // 退出登录 (可以直接调用 removeToken 和 reomveUserInfo  但多出地方要用到 所有封装成函数)
  logout(context) {
    context.commit('removeToken')
    context.commit('reomveUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
