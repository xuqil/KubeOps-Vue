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

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor);

//编辑器
import VueCodemirror from 'vue-codemirror'
// import base style
import 'codemirror/lib/codemirror.css'
// import more codemirror resource...
// you can set default global options and events when Vue.use
Vue.use(VueCodemirror, /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */);

Vue.prototype.$api = API;
//全局的时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

