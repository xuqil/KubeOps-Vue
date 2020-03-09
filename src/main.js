import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入element ui
import './plugins/element.js'
//导入全局样式
import "assets/css/base.css";
//导入图标
import "assets/fonts/iconfont.css"



Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

