import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  //  {
  //   path: '/myNovels',
  //   name: 'myNovels',
  //   component: () => import('../views/myNovels.vue'),
  //   meta: {
  //     title: 'My Novels',
  //   },
  // },
  // {
  //   path: '/editNovel',
  //   name: 'editNovel',
  //   component: () => import('../views/editNovel.vue'),
  //   meta: {
  //     title: 'Edit Novel',
  //   },
  // },
  // {
  //   path: '/textArea',
  //   name: 'textArea',
  //   component: () => import('../components/textArea.vue'),
  //   meta: {
  //     title: 'Edit Novel',
  //   },
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('../views/login.vue'),
  //   meta: {
  //     title: '登陆页',
  //   },
  // },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../views/test.vue'),
  //   meta: {
  //     title: '测试页',
  //   },
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

export default router
