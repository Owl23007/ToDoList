import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页'
    }
  },
  // 添加一个通配符路由，处理未匹配的路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - TodoList` : 'TodoList'
  next()
})

export default router
