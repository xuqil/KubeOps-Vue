import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Login = () => import('components/common/login/Login');
const Register = () => import('components/common/login/Register');

const Home = () => import('views/home/Home');

const routes = [
  {
    path: '',
    component: Home,
    name: "home",
    meta: {
      title: '主页'
    }
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: {
      title: '注册'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 前置钩子(hook) or 前置守卫(guard):路由跳转前进行回调
// 通过导航守卫实时更改页面标题
router.beforeEach((to, from, next) => {
  //在各组件路由中定义meta的title
  document.title = to.matched[0].meta.title;
  //必须调用的函数，否则链接不能调转到next
  next()
});

export default router
