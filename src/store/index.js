import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: false, //侧栏默认闭合
    username: '', //登录用户
  },
  mutations: {
    isCollapse: state => {
      state.isCollapse = !state.isCollapse
    },
    saveUsername: ((state, payload) => {
      state.username = payload
    })
  },
  getters: {
    isCollapse: state => state.isCollapse,
    getUsername: state => state.username,
  },
  actions: {
  },
  modules: {
  }
})
