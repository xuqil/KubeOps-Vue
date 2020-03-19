import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: false, //侧栏默认闭合
    username: '', //登录用户
    userId: '', //登录用户ID
  },
  mutations: {
    isCollapse: state => {
      state.isCollapse = !state.isCollapse
    },
    saveUsername: ((state, payload) => {
      state.username = payload
    }),
    saveUserId: ((state, payload) => {
      state.userId = payload
    }),
  },
  getters: {
    isCollapse: state => state.isCollapse,
    getUsername: state => state.username,
    getUserId: state => state.userId,
  },
  actions: {
  },
  modules: {
  }
})
