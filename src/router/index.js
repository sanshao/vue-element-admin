import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('error/404'), hidden: true },
    { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/feed',
    component: Layout,
    redirect: '/feed/index',
    name: "动态",
    icon: 'zujian',
    children: [
      {
        path: 'list',
        component: _import('feed/list'),
        name: '动态列表'
      },
      {
        path: 'add',
        component: _import('feed/add'),
        name: '添加动态'
      }
    ]
  },
  {
    path: '/star',
    component: Layout,
    redirect: '/star/index',
    name: "艺人",
    icon: 'zujian',
    children: [
      {
        path: 'list',
        // component: _import('feed/list'),
        name: '艺人列表'
      },
      {
        path: 'add-single',
        // component: _import('feed/list'),
        name: '添加明星'
      },
      {
        path: 'add-combo',
        // component: _import('feed/list'),
        name: '添加组合'
      },
      {
        path: 'sort',
        // component: _import('feed/add'),
        name: '艺人排序'
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: "用户",
    icon: 'zujian',
    children: [
      {
        path: 'list',
        // component: _import('feed/list'),
        name: '用户列表'
      }
    ],
  },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: '/components/index',
  //   name: '组件',
  //   icon: 'zujian',
  //   children: [
  //     { path: 'index', component: _import('components/index'), name: '介绍 ' },
  //     { path: 'tinymce', component: _import('components/tinymce'), name: '富文本编辑器' },
  //     { path: 'markdown', component: _import('components/markdown'), name: 'Markdown' },
  //     { path: 'jsoneditor', component: _import('components/jsoneditor'), name: 'JSON编辑器' },
  //     { path: 'dndlist', component: _import('components/dndlist'), name: '列表拖拽' },
  //     { path: 'splitpane', component: _import('components/splitpane'), name: 'SplitPane' },
  //     { path: 'avatarupload', component: _import('components/avatarUpload'), name: '头像上传' },
  //     { path: 'dropzone', component: _import('components/dropzone'), name: 'Dropzone' },
  //     { path: 'sticky', component: _import('components/sticky'), name: 'Sticky' },
  //     { path: 'countto', component: _import('components/countTo'), name: 'CountTo' },
  //     { path: 'mixin', component: _import('components/mixin'), name: '小组件' },
  //     { path: 'backtotop', component: _import('components/backToTop'), name: '返回顶部' }
  //   ]
  // },
  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    icon: '404',
    children: [
      { path: '401', component: _import('error/401'), name: '401' },
      { path: '404', component: _import('error/404'), name: '404' }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    name: 'theme',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: _import('theme/index'), name: '换肤' }]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'quanxian',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页', meta: { role: ['admin'] } }]
  },

  { path: '*', redirect: '/404', hidden: true }
];
