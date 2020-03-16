import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入element ui
import './plugins/element.js'
//导入全局样式
import "assets/css/global.css";
//导入图标
import "assets/fonts/iconfont.css"
//导入api
import API from 'network/api'

Vue.prototype.$api = API;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

