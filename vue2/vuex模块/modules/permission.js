import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上加 如果用 routes 每次切换用户权限都会叠加
  }
}

const actions = {
  filterRoutes(context, menus) {
    const routes = asyncRoutes.filter((item) =>
      menus.includes(item.children[0].name)
    )
    context.commit('setRoutes', routes)
    return routes // state 数据 是用来 显示左侧菜单的  return 是给路由 addRoutes 用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
