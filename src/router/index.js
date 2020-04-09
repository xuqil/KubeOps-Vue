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
const WebSSH = () => import('views/assets/WebSSH');
const Monitor = () => import('views/monitor/Monitor');
const Files = () => import('views/files/Files');
const Deployment = () => import('views/deployment/Deployment');
const Wiki = () => import('views/wiki/Wiki');
const Edit = () => import('views/wiki/Edit');
const Add = () => import('views/wiki/Add');
const Settings = () => import('views/platform/Settings');
const Kubernetes = () => import('views/platform/Kubernetes');
const Task = () => import('views/task/Task');

const routes = [
  {
    path: '/home',
    component: Home,
    name: "home",
    meta: {
      title: '主页'
    },
    children: [
      {path: '/home', component: Welcome, meta: {keepAlive: false}},
      {path: '/users', component: Users, meta: {keepAlive: true}},
      {path: '/user', component: User, meta: {keepAlive: true}},
      {path: '/rights', component: Rights, meta: {keepAlive: true}},
      {path: '/roles', component: Roles, meta: {keepAlive: true}},
      {path: '/server', component: Server, meta: {keepAlive: true}},
      {path: '/idc', component: IDC, meta: {keepAlive: true}},
      {path: '/tags', component: Tags, meta: {keepAlive: true}},
      {path: '/webssh', component: WebSSH, meta: {keepAlive: false}},
      {path: '/monitor', component: Monitor, meta: {keepAlive: false}},
      {path: '/files', component: Files, meta: {keepAlive: true}},
      {path: '/deploy', component: Deployment, meta: {keepAlive: false}},
      {path: '/wiki', component: Wiki, meta: {keepAlive: true}},
      {path: '/wiki/edit', component: Edit, meta: {keepAlive: false}},
      {path: '/wiki/add', component: Add, meta: {keepAlive: false}},
      {path: '/settings', component: Settings, meta: {keepAlive: true}},
      {path: '/kubernetes', component: Kubernetes, meta: {keepAlive: true}},
      {path: '/task', component: Task, meta: {keepAlive: true}},
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
  if (to.matched.length !== 0) document.title = to.matched[0].meta.title;
  //必须调用的函数，否则链接不能调转到next
  next()
});

export default router
