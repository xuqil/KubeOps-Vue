import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: false, //侧栏默认闭合
    username: '', //登录用户
    userId: '', //登录用户ID
    backgroundColor: '',
    headBackgroundColor: 'rgba(245, 245, 245, 1)',
    menuBackgroundColor: 'rgba(0, 35, 60, 1)',
    mainBackgroundColor: 'rgba(255, 255, 255, 1)',
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
    saveBackgroundColor: ((state, payload) => {
      state.backgroundColor = payload
    }),
    saveHeadBackgroundColor: ((state, payload) => {
      state.headBackgroundColor = payload
    }),
    saveMenuBackgroundColor: ((state, payload) => {
      state.menuBackgroundColor = payload
    }),
    saveMainBackgroundColor: ((state, payload) => {
      state.mainBackgroundColor = payload
    })
  },
  getters: {
    isCollapse: state => state.isCollapse,
    getUsername: state => state.username,
    getUserId: state => state.userId,
    getHeadBackgroundColor: state => state.headBackgroundColor,
    getMenuBackgroundColor: state => state.menuBackgroundColor,
    getMainBackgroundColor: state => state.mainBackgroundColor,
  },
  actions: {},
  modules: {}
})
