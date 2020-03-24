import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Login = () => import('components/common/login/Login');
const Register = () => import('components/common/login/Register');

const Home = () => import('views/home/Home');
const Welcome = () => import('views/home/Welcome');
const Users = () => import('views/user/Users');
const User = () => import('views/user/User');
const Rights = () => import('views/power/Rights');
const Roles = () => import('views/power/Roles');
const Server = () => import('views/assets/Server');
const IDC = () => import('views/assets/IDC');
const Tags = () => import('views/assets/Tags');

const routes = [
  {
    path: '/home',
    component: Home,
    name: "home",
    meta: {
      title: '主页'
    },
    children: [
      { path: '/home', component: Welcome },
      { path: '/users', component: Users },
      { path: '/user', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/server', component: Server },
      { path: '/idc', component: IDC },
      { path: '/tags', component: Tags },
    ]
  },
  {
    path: '',
    redirect: '/login'
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
  // 访问登录页，放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login');
  //在各组件路由中定义meta的title
  if(to.matched.length !== 0) document.title = to.matched[0].meta.title;
  //必须调用的函数，否则链接不能调转到next
  next()
});

export default router
