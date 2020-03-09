import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isCollapse: true //侧栏默认闭合
  },
  mutations: {
    isCollapse: state => {
      state.isCollapse = !state.isCollapse
    }
  },
  getters: {
    isCollapse: state => state.isCollapse
  },
  actions: {
  },
  modules: {
  }
})
